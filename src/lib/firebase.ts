/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import {
  getFirestore,
  initializeFirestore,
  doc,
  getDoc,
  getDocs,
  setDoc,
  deleteDoc,
  collection,
  query,
  limit,
  runTransaction,
  getDocFromServer,
  setLogLevel
} from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';

const app = initializeApp(firebaseConfig);
const firestoreDatabaseId = (firebaseConfig as any).firestoreDatabaseId;

// Silence internal transport warnings and enable auto-detected HTTP long-polling fallback
// so Firestore WebChannel streams never drop or throw socket errors in proxied/iframe environments.
setLogLevel('silent');

export const db = (() => {
  try {
    return initializeFirestore(
      app,
      {
        experimentalAutoDetectLongPolling: true,
        experimentalLongPollingOptions: {
          timeoutSeconds: 25,
        },
        ignoreUndefinedProperties: true,
      },
      firestoreDatabaseId
    );
  } catch {
    return getFirestore(app, firestoreDatabaseId); /* CRITICAL */
  }
})();

export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
googleProvider.addScope('https://www.googleapis.com/auth/tasks');

// Secure cache for Google OAuth Access Token with persistence (3 hours expiry)
let cachedAccessToken: string | null = null;
const THREE_HOURS_MS = 3 * 60 * 60 * 1000;

export function setGoogleAccessToken(token: string | null) {
  cachedAccessToken = token;
  try {
    if (token) {
      localStorage.setItem('practca_google_access_token', token);
      localStorage.setItem('practca_google_access_token_saved_at', Date.now().toString());
    } else {
      localStorage.removeItem('practca_google_access_token');
      localStorage.removeItem('practca_google_access_token_saved_at');
    }
  } catch (e) {
    console.error("Storage error setting Google Access Token:", e);
  }
}

export function getGoogleAccessToken(): string | null {
  if (cachedAccessToken) {
    return cachedAccessToken;
  }
  try {
    const token = localStorage.getItem('practca_google_access_token');
    const savedAtStr = localStorage.getItem('practca_google_access_token_saved_at');
    if (token && savedAtStr) {
      const savedAt = parseInt(savedAtStr, 10);
      if (!isNaN(savedAt) && (Date.now() - savedAt < THREE_HOURS_MS)) {
        cachedAccessToken = token;
        return token;
      } else {
        // Expired
        localStorage.removeItem('practca_google_access_token');
        localStorage.removeItem('practca_google_access_token_saved_at');
      }
    }
  } catch (e) {
    console.error("Storage error parsing Google Access Token:", e);
  }
  return null;
}

export { signInWithPopup, GoogleAuthProvider, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut };

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errorMessage = error instanceof Error ? error.message : String(error);
  const errorCode = (error as any)?.code || '';

  const isPermissionError = 
    errorCode === 'permission-denied' || 
    errorMessage.toLowerCase().includes('permission') || 
    errorMessage.toLowerCase().includes('insufficient');

  const errInfo: FirestoreErrorInfo = {
    error: errorMessage,
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData?.map(provider => ({
        providerId: provider.providerId,
        email: provider.email,
      })) || []
    },
    operationType,
    path
  };

  if (isPermissionError) {
    console.debug('Firestore Permission Alert (using local offline cache):', JSON.stringify(errInfo));
  } else {
    // Gracefully handle other errors (transient network, offline, server unavailable)
    // to keep the client running from local cache and localStorage
    console.debug('Firestore Operation Offline/Transient Alert:', errInfo.error);
  }
}

export async function testConnection() {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
  } catch (error) {
    // Quietly fallback for offline state
    console.debug("Firestore connection check noted offline/delayed startup.");
  }
}

// Normalizes a username handle to lowercase and strips any leading '@' or spaces
export function normalizeUsername(raw: string): string {
  if (!raw) return '';
  return raw.trim().replace(/^@+/, '').toLowerCase();
}

// Preserves user-chosen casing while stripping leading '@' and spaces
export function cleanDisplayUsername(raw: string): string {
  if (!raw) return '';
  return raw.trim().replace(/^@+/, '');
}

// Validates username against 3–24 characters: letters, numbers, underscores (_), and dots (.)
export function validateUsernameFormat(raw: string): {
  valid: boolean;
  error?: string;
  normalized: string;
  display: string;
} {
  const display = cleanDisplayUsername(raw);
  const normalized = normalizeUsername(raw);

  if (!normalized) {
    return {
      valid: false,
      error: 'Please enter a username (3 to 24 characters).',
      normalized,
      display
    };
  }
  if (normalized.length < 3) {
    return {
      valid: false,
      error: 'Username must be at least 3 characters long.',
      normalized,
      display
    };
  }
  if (normalized.length > 24) {
    return {
      valid: false,
      error: 'Username cannot exceed 24 characters.',
      normalized,
      display
    };
  }
  if (!/^[a-zA-Z0-9_.]+$/.test(display)) {
    return {
      valid: false,
      error: 'Only letters, numbers, underscores (_), and dots (.) are allowed.',
      normalized,
      display
    };
  }
  return { valid: true, normalized, display };
}

export interface UsernameRegistryItem {
  normalizedHandle: string;
  displayHandle: string;
  uid: string;
  displayName?: string;
  updatedAt: string;
}

const LOCAL_USERNAME_REGISTRY_KEY = 'practca_username_registry_v1';

export function loadLocalUsernameRegistry(): Record<string, UsernameRegistryItem> {
  try {
    const raw = localStorage.getItem(LOCAL_USERNAME_REGISTRY_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

export function saveLocalUsernameRegistry(registry: Record<string, UsernameRegistryItem>): void {
  try {
    localStorage.setItem(LOCAL_USERNAME_REGISTRY_KEY, JSON.stringify(registry));
  } catch {}
}

// Generates a clean student username handle (respects custom studentHandle/displayHandle first)
export function getSimpleUsername(
  user: { uid?: string; displayName?: string; email?: string; studentHandle?: string; displayHandle?: string } | null | any
): string {
  if (!user) return 'guest_student';
  if (user.displayHandle) {
    return cleanDisplayUsername(user.displayHandle);
  }
  if (user.studentHandle) {
    return cleanDisplayUsername(user.studentHandle);
  }
  const namePart = (user.displayName || user.email?.split('@')[0] || 'student')
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '_')
    .slice(0, 15);
  const cleanedName = namePart.replace(/_+/g, '_').replace(/^_+|_+$/g, '');
  const shortId = user.uid ? user.uid.slice(0, 4).toLowerCase() : 'guest';
  return `${cleanedName || 'student'}_${shortId}`.slice(0, 24);
}

/**
 * Checks case-insensitive availability of a username across both `/usernames/{normalized}`
 * and `/users` (for any legacy handles) + local cache.
 */
export async function checkUsernameAvailability(
  rawInput: string,
  currentUid?: string
): Promise<{
  available: boolean;
  isCurrentUsers: boolean;
  reason?: string;
  normalized: string;
  display: string;
  ownerUid?: string;
}> {
  const formatCheck = validateUsernameFormat(rawInput);
  if (!formatCheck.valid) {
    return {
      available: false,
      isCurrentUsers: false,
      reason: formatCheck.error,
      normalized: formatCheck.normalized,
      display: formatCheck.display
    };
  }

  const { normalized, display } = formatCheck;
  const localReg = loadLocalUsernameRegistry();

  // Check Firestore if authenticated
  if (auth.currentUser) {
    try {
      // 1. Direct O(1) lookup in canonical /usernames/{normalized} registry
      const usernameDocRef = doc(db, 'usernames', normalized);
      const usernameSnap = await getDoc(usernameDocRef);
      if (usernameSnap.exists()) {
        const data = usernameSnap.data() as UsernameRegistryItem;
        localReg[normalized] = data;
        saveLocalUsernameRegistry(localReg);

        if (currentUid && data.uid === currentUid) {
          return {
            available: true,
            isCurrentUsers: true,
            reason: 'This is already your active custom username.',
            normalized,
            display,
            ownerUid: data.uid
          };
        }
        return {
          available: false,
          isCurrentUsers: false,
          reason: `@${normalized} is already taken (first-come, first-served).`,
          normalized,
          display,
          ownerUid: data.uid
        };
      }

      // 2. Cross-check /users collection case-insensitively to catch any pre-existing handles
      const usersSnap = await getDocs(query(collection(db, 'users'), limit(200)));
      let conflictUid: string | null = null;
      usersSnap.forEach(d => {
        const uData = d.data();
        const existingNorm = normalizeUsername(uData.studentHandle || uData.displayHandle || '');
        if (existingNorm && existingNorm === normalized) {
          const holderUid = uData.uid || d.id;
          localReg[existingNorm] = {
            normalizedHandle: existingNorm,
            displayHandle: cleanDisplayUsername(uData.displayHandle || uData.studentHandle || existingNorm),
            uid: holderUid,
            displayName: uData.displayName || 'CA Finalist',
            updatedAt: uData.updatedAt || new Date().toISOString()
          };
          if (!currentUid || holderUid !== currentUid) {
            conflictUid = holderUid;
          }
        }
      });
      saveLocalUsernameRegistry(localReg);

      if (conflictUid) {
        return {
          available: false,
          isCurrentUsers: false,
          reason: `@${normalized} is already registered by another student.`,
          normalized,
          display,
          ownerUid: conflictUid
        };
      }
    } catch (err) {
      console.debug('Username availability check fallback to local registry:', err);
    }
  }

  // 3. Check local registry cache
  const localHit = localReg[normalized];
  if (localHit) {
    if (currentUid && localHit.uid === currentUid) {
      return {
        available: true,
        isCurrentUsers: true,
        reason: 'This is already your active custom username.',
        normalized,
        display,
        ownerUid: localHit.uid
      };
    }
    return {
      available: false,
      isCurrentUsers: false,
      reason: `@${normalized} is already taken (first-come, first-served).`,
      normalized,
      display,
      ownerUid: localHit.uid
    };
  }

  return {
    available: true,
    isCurrentUsers: false,
    reason: `@${display} is available!`,
    normalized,
    display
  };
}

/**
 * Atomically claims a custom username on a first-come, first-served basis (case-insensitive),
 * releases the user's previous username from `/usernames/{oldHandle}` so others can claim it,
 * and propagates the new handle to `/users/{uid}` and connected buddies.
 */
export async function claimCustomUsername(params: {
  rawInput: string;
  currentUid: string;
  currentDisplayName?: string;
  previousHandle?: string;
}): Promise<{
  success: boolean;
  normalizedHandle: string;
  displayHandle: string;
  error?: string;
}> {
  const { rawInput, currentUid, currentDisplayName, previousHandle } = params;
  const check = await checkUsernameAvailability(rawInput, currentUid);

  if (!check.available) {
    return {
      success: false,
      normalizedHandle: check.normalized,
      displayHandle: check.display,
      error: check.reason || 'Username is not available.'
    };
  }

  const { normalized, display } = check;
  const now = new Date().toISOString();
  const prevNorm = previousHandle ? normalizeUsername(previousHandle) : '';

  if (auth.currentUser && currentUid !== 'guest_user') {
    try {
      await runTransaction(db, async transaction => {
        const newUsernameRef = doc(db, 'usernames', normalized);
        const newUsernameSnap = await transaction.get(newUsernameRef);

        if (newUsernameSnap.exists()) {
          const holder = newUsernameSnap.data() as UsernameRegistryItem;
          if (holder.uid !== currentUid) {
            throw new Error(`@${normalized} was just claimed by another student.`);
          }
        }

        const userRef = doc(db, 'users', currentUid);
        const userSnap = await transaction.get(userRef);
        const storedOldNorm = userSnap.exists()
          ? normalizeUsername(userSnap.data().studentHandle || '')
          : prevNorm;

        const oldRefToRelease =
          storedOldNorm && storedOldNorm !== normalized && storedOldNorm.length >= 3
            ? doc(db, 'usernames', storedOldNorm)
            : null;
        const oldUsernameSnap = oldRefToRelease ? await transaction.get(oldRefToRelease) : null;

        // 1. Register new username in /usernames/{normalized}
        transaction.set(newUsernameRef, {
          normalizedHandle: normalized,
          displayHandle: display,
          uid: currentUid,
          displayName: (currentDisplayName || 'CA Finalist').slice(0, 200),
          updatedAt: now
        });

        // 2. Release old username if owned by currentUid
        if (oldRefToRelease && oldUsernameSnap && oldUsernameSnap.exists()) {
          if (oldUsernameSnap.data().uid === currentUid) {
            transaction.delete(oldRefToRelease);
          }
        }

        // 3. Also release prevNorm if different from storedOldNorm
        if (prevNorm && prevNorm !== storedOldNorm && prevNorm !== normalized && prevNorm.length >= 3) {
          // Will clean up after transaction
        }

        // 4. Update user's profile document
        transaction.set(
          userRef,
          {
            studentHandle: normalized,
            displayHandle: display,
            updatedAt: now
          },
          { merge: true }
        );
      });

      // If prevNorm was different, ensure it is deleted if owned by currentUid
      if (prevNorm && prevNorm !== normalized && prevNorm.length >= 3) {
        try {
          const prevRef = doc(db, 'usernames', prevNorm);
          const prevSnap = await getDoc(prevRef);
          if (prevSnap.exists() && prevSnap.data().uid === currentUid) {
            await deleteDoc(prevRef);
          }
        } catch {}
      }

      // Propagate updated studentHandle to connected buddies' /users/{peerId}/peers/{currentUid}
      try {
        const myPeersSnap = await getDocs(collection(db, 'users', currentUid, 'peers'));
        const updatePromises: Promise<any>[] = [];
        myPeersSnap.forEach(peerDoc => {
          const peerUid = peerDoc.id;
          if (peerUid) {
            updatePromises.push(
              setDoc(
                doc(db, 'users', peerUid, 'peers', currentUid),
                {
                  uid: currentUid,
                  studentHandle: normalized,
                  displayName: currentDisplayName || 'CA Finalist'
                },
                { merge: true }
              ).catch(() => {})
            );
          }
        });
        await Promise.all(updatePromises);
      } catch {}
    } catch (err: any) {
      return {
        success: false,
        normalizedHandle: normalized,
        displayHandle: display,
        error: err?.message || 'Failed to claim username in registry.'
      };
    }
  }

  // Update local registry cache & local user storage
  const localReg = loadLocalUsernameRegistry();
  if (prevNorm && prevNorm !== normalized && localReg[prevNorm]?.uid === currentUid) {
    delete localReg[prevNorm];
  }
  localReg[normalized] = {
    normalizedHandle: normalized,
    displayHandle: display,
    uid: currentUid,
    displayName: currentDisplayName || 'CA Finalist',
    updatedAt: now
  };
  saveLocalUsernameRegistry(localReg);

  try {
    const rawUser = localStorage.getItem('practca_custom_user');
    if (rawUser) {
      const parsed = JSON.parse(rawUser);
      parsed.studentHandle = normalized;
      parsed.displayHandle = display;
      localStorage.setItem('practca_custom_user', JSON.stringify(parsed));
    }
    const rawGuest = localStorage.getItem('practca_guest_profile');
    if (rawGuest && currentUid === 'guest_user') {
      const parsedGuest = JSON.parse(rawGuest);
      parsedGuest.studentHandle = normalized;
      parsedGuest.displayHandle = display;
      localStorage.setItem('practca_guest_profile', JSON.stringify(parsedGuest));
    }
    window.dispatchEvent(
      new CustomEvent('practca_username_updated', {
        detail: { uid: currentUid, studentHandle: normalized, displayHandle: display }
      })
    );
  } catch {}

  return {
    success: true,
    normalizedHandle: normalized,
    displayHandle: display
  };
}

/**
 * Ensures a user's initial handle is recorded in `/usernames/{normalized}` if not yet registered.
 */
export async function ensureDefaultUsernameRegistered(
  uid: string,
  rawHandle: string,
  displayName?: string
): Promise<string> {
  const format = validateUsernameFormat(rawHandle);
  const baseNorm = format.valid
    ? format.normalized
    : `student_${uid.slice(0, 6).toLowerCase().replace(/[^a-z0-9]/g, '')}`;

  if (!auth.currentUser || uid === 'guest_user') return baseNorm;

  try {
    const ref = doc(db, 'usernames', baseNorm);
    const snap = await getDoc(ref);
    if (!snap.exists()) {
      await setDoc(ref, {
        normalizedHandle: baseNorm,
        displayHandle: format.valid ? format.display : baseNorm,
        uid,
        displayName: (displayName || 'CA Finalist').slice(0, 200),
        updatedAt: new Date().toISOString()
      });
      const localReg = loadLocalUsernameRegistry();
      localReg[baseNorm] = {
        normalizedHandle: baseNorm,
        displayHandle: format.valid ? format.display : baseNorm,
        uid,
        displayName: displayName || 'CA Finalist',
        updatedAt: new Date().toISOString()
      };
      saveLocalUsernameRegistry(localReg);
      return baseNorm;
    }
    if (snap.data().uid === uid) {
      return baseNorm;
    }
    // If taken by someone else, append short UID suffix
    const fallbackNorm = `${baseNorm.slice(0, 18)}_${uid.slice(0, 4).toLowerCase()}`;
    return fallbackNorm;
  } catch {
    return baseNorm;
  }
}

/**
 * Releases a user's claimed username when they delete their account.
 */
export async function releaseUsernameOnDelete(uid: string, rawHandle?: string): Promise<void> {
  const norm = rawHandle ? normalizeUsername(rawHandle) : '';
  const localReg = loadLocalUsernameRegistry();
  Object.keys(localReg).forEach(k => {
    if (localReg[k].uid === uid) delete localReg[k];
  });
  saveLocalUsernameRegistry(localReg);

  if (!auth.currentUser || !norm || norm.length < 3) return;
  try {
    const ref = doc(db, 'usernames', norm);
    const snap = await getDoc(ref);
    if (snap.exists() && snap.data().uid === uid) {
      await deleteDoc(ref);
    }
  } catch {}
}

/**
 * Loads all registered usernames across `/usernames` and `/users` so the system maintains
 * a complete, visible record of existing handles.
 */
export async function fetchRegisteredUsernames(): Promise<UsernameRegistryItem[]> {
  const map = new Map<string, UsernameRegistryItem>();
  const localReg = loadLocalUsernameRegistry();
  Object.values(localReg).forEach(item => {
    if (item && item.normalizedHandle) {
      map.set(item.normalizedHandle, item);
    }
  });

  if (auth.currentUser) {
    try {
      const snap = await getDocs(query(collection(db, 'usernames'), limit(200)));
      snap.forEach(d => {
        const data = d.data() as UsernameRegistryItem;
        if (data && data.normalizedHandle) {
          map.set(data.normalizedHandle, data);
        }
      });

      const usersSnap = await getDocs(query(collection(db, 'users'), limit(200)));
      usersSnap.forEach(d => {
        const uData = d.data();
        const norm = normalizeUsername(uData.studentHandle || '');
        if (norm && norm.length >= 3 && !map.has(norm)) {
          map.set(norm, {
            normalizedHandle: norm,
            displayHandle: cleanDisplayUsername(uData.displayHandle || uData.studentHandle || norm),
            uid: uData.uid || d.id,
            displayName: uData.displayName || 'CA Finalist',
            updatedAt: uData.updatedAt || ''
          });
        }
      });
    } catch {}
  }

  const combined = Array.from(map.values());
  const nextLocal: Record<string, UsernameRegistryItem> = {};
  combined.forEach(item => {
    nextLocal[item.normalizedHandle] = item;
  });
  saveLocalUsernameRegistry(nextLocal);
  return combined.sort((a, b) => a.normalizedHandle.localeCompare(b.normalizedHandle));
}

