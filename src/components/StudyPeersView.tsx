import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  Users,
  UserPlus,
  Search,
  Check,
  X,
  Clock,
  Award,
  Flame,
  TrendingUp,
  Shield,
  Sparkles,
  Copy,
  CheckCircle2,
  AlertCircle,
  MessageSquare,
  Send,
  Trash2,
  Hash,
  BookOpen,
  Lock,
  Unlock,
  Globe,
  Eye,
  EyeOff,
  HelpCircle,
  FileText,
  Plus,
  KeyRound,
  Filter,
  ArrowUpRight,
  SlidersHorizontal,
  UserCheck,
  Reply,
  Layers,
  Edit3
} from 'lucide-react';
import {
  auth,
  db,
  handleFirestoreError,
  OperationType,
  normalizeUsername,
  cleanDisplayUsername,
  validateUsernameFormat,
  checkUsernameAvailability,
  claimCustomUsername,
  ensureDefaultUsernameRegistered,
  fetchRegisteredUsernames,
  UsernameRegistryItem
} from '../lib/firebase';
import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  onSnapshot,
  limit
} from 'firebase/firestore';

interface PeerProfile {
  uid: string;
  studentHandle: string;
  displayHandle?: string;
  displayName: string;
  emote: string;
  coursePreference: string;
  motto?: string;
  studyStatus?: string;
  dailyGoalMinutes?: number;
  privacyScope?: 'public' | 'buddies' | 'private';
  shareHours?: boolean;
  shareAccuracy?: boolean;
  shareStreak?: boolean;
  todayFocusMinutes?: number;
  totalFocusMinutes?: number;
  practiceAccuracy?: number;
  practiceQuestionsCount?: number;
  studyStreakDays?: number;
  lastActiveAt?: string;
}

interface PeerRequest {
  id: string;
  fromUserId: string;
  fromUserHandle: string;
  fromUserName: string;
  fromUserEmote: string;
  toUserId: string;
  toUserHandle: string;
  toUserName: string;
  status: 'pending' | 'accepted' | 'declined';
  timestamp: string;
}

interface PeerStats {
  totalFocusMinutes: number;
  todayFocusMinutes: number;
  subjectBreakdown: Record<string, number>;
  questionsAttempted: number;
  accuracy: number;
  streakDays: number;
}

interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  senderEmote: string;
  receiverId: string;
  text: string;
  timestamp: string;
  msgType?: 'chat' | 'doubt' | 'request';
  subjectTag?: string;
  chapterTag?: string;
  isResolved?: boolean;
  resolvedBy?: string;
}

interface StudyRoom {
  id: string;
  name: string;
  subjectId: string;
  topic: string;
  isPrivate: boolean;
  inviteCode?: string;
  creatorId: string;
  creatorName: string;
  memberIds?: string[];
  createdAt: string;
}

interface SubjectCircle {
  id: string;
  subjectId: 'FR' | 'AFM' | 'Audit' | 'DT' | 'IDT' | 'IBS';
  paperNo: string;
  name: string;
  description: string;
  activeTopics: string[];
  accentBg: string;
  accentText: string;
  accentBorder: string;
}

const PAPER_BADGE_STYLES: Record<string, { bg: string; text: string; border: string }> = {
  FR: {
    bg: 'bg-sky-500/15',
    text: 'text-sky-300',
    border: 'border-sky-500/35'
  },
  AFM: {
    bg: 'bg-emerald-500/15',
    text: 'text-emerald-300',
    border: 'border-emerald-500/35'
  },
  Audit: {
    bg: 'bg-amber-500/15',
    text: 'text-amber-300',
    border: 'border-amber-500/35'
  },
  DT: {
    bg: 'bg-rose-500/15',
    text: 'text-rose-300',
    border: 'border-rose-500/35'
  },
  IDT: {
    bg: 'bg-indigo-500/15',
    text: 'text-indigo-300',
    border: 'border-indigo-500/35'
  },
  IBS: {
    bg: 'bg-cyan-500/15',
    text: 'text-cyan-300',
    border: 'border-cyan-500/35'
  },
  General: {
    bg: 'bg-slate-800/90',
    text: 'text-slate-300',
    border: 'border-slate-700'
  }
};

const SUBJECT_CIRCLES: SubjectCircle[] = [
  {
    id: 'circle_FR',
    subjectId: 'FR',
    paperNo: 'Paper 1',
    name: 'Financial Reporting (FR)',
    description: 'Ind AS 115, 116, 109, Business Combinations & Consolidated FS doubt resolution.',
    activeTopics: ['Ind AS 109', 'Ind AS 115', 'CFS & Ind AS 103'],
    accentBg: 'bg-sky-500/15',
    accentText: 'text-sky-300',
    accentBorder: 'border-sky-500/35'
  },
  {
    id: 'circle_AFM',
    subjectId: 'AFM',
    paperNo: 'Paper 2',
    name: 'Advanced Financial Management (AFM)',
    description: 'Forex Exposure, Derivatives, Valuation, Portfolio Management & Capital Budgeting.',
    activeTopics: ['Forex Hedging', 'Swaps & Options', 'M&A Valuation'],
    accentBg: 'bg-emerald-500/15',
    accentText: 'text-emerald-300',
    accentBorder: 'border-emerald-500/35'
  },
  {
    id: 'circle_Audit',
    subjectId: 'Audit',
    paperNo: 'Paper 3',
    name: 'Advanced Auditing & Professional Ethics',
    description: 'Standards on Auditing (SA 200–720), CARO 2020 & Chartered Accountants Act Clauses.',
    activeTopics: ['Professional Ethics', 'CARO 2020', 'SA 500–580'],
    accentBg: 'bg-amber-500/15',
    accentText: 'text-amber-300',
    accentBorder: 'border-amber-500/35'
  },
  {
    id: 'circle_DT',
    subjectId: 'DT',
    paperNo: 'Paper 4',
    name: 'Direct Tax Laws & International Taxation',
    description: 'PGBP, MAT/AMT, Assessment, TDS/TCS, Non-Resident Taxation, DTAA & Transfer Pricing.',
    activeTopics: ['PGBP Adjustments', 'Transfer Pricing', 'DTAA & Equalization'],
    accentBg: 'bg-rose-500/15',
    accentText: 'text-rose-300',
    accentBorder: 'border-rose-500/35'
  },
  {
    id: 'circle_IDT',
    subjectId: 'IDT',
    paperNo: 'Paper 5',
    name: 'Indirect Tax Laws (GST & Customs)',
    description: 'Place of Supply, ITC Rule 42/43, Valuation, Refunds, Appeals & Customs Baggage/Valuation.',
    activeTopics: ['ITC Sec 16–18', 'Place of Supply', 'Customs Valuation'],
    accentBg: 'bg-indigo-500/15',
    accentText: 'text-indigo-300',
    accentBorder: 'border-indigo-500/35'
  },
  {
    id: 'circle_IBS',
    subjectId: 'IBS',
    paperNo: 'Paper 6',
    name: 'Integrated Business Solutions (IBS)',
    description: 'Multidisciplinary Case Study Index mapping, cross-paper statutory linking & open-book drills.',
    activeTopics: ['Multi-Paper Caselets', 'Index Mapping', 'Ind AS + Tax Link'],
    accentBg: 'bg-cyan-500/15',
    accentText: 'text-cyan-300',
    accentBorder: 'border-cyan-500/35'
  }
];

const DEFAULT_STUDY_ROOMS: StudyRoom[] = [
  {
    id: 'room_indas_sprint',
    name: 'Ind AS 109 & 115 Rapid Doubt Desk',
    subjectId: 'FR',
    topic: 'Financial Instruments & Revenue 5-Step Model Case Studies',
    isPrivate: false,
    creatorId: 'system',
    creatorName: 'ICAI Peer Desk',
    memberIds: [],
    createdAt: '2026-05-01T08:00:00.000Z'
  },
  {
    id: 'room_dt_tp_dtaa',
    name: 'International Tax & Transfer Pricing Vault',
    subjectId: 'DT',
    topic: 'Sec 92–92F Arm’s Length Price & DTAA Relief Computations',
    isPrivate: false,
    creatorId: 'system',
    creatorName: 'ICAI Peer Desk',
    memberIds: [],
    createdAt: '2026-05-01T09:00:00.000Z'
  },
  {
    id: 'room_audit_ethics',
    name: 'First & Second Schedule Ethics Drill Room',
    subjectId: 'Audit',
    topic: 'Clause-by-clause caselet analysis & CARO 2020 Paragraph 3',
    isPrivate: false,
    creatorId: 'system',
    creatorName: 'ICAI Peer Desk',
    memberIds: [],
    createdAt: '2026-05-01T10:00:00.000Z'
  }
];

const STUDY_STATUS_OPTIONS = [
  'Focusing on FR (Ind AS)',
  'Solving AFM Deriv/Forex',
  'Revising SAs & Ethics',
  'Direct Tax & Intl Tax',
  'GST & Customs ITC',
  'IBS Multidisciplinary Case',
  'Available to Clear Doubts',
  'In Deep Pomodoro Sprint'
];

export const StudyPeersView: React.FC = () => {
  // Primary 4-tab navigation (VC completely removed)
  const [activeTab, setActiveTab] = useState<'chat' | 'rooms' | 'global' | 'buddies'>('chat');

  // Search & Buddy Connection States
  const [searchHandle, setSearchHandle] = useState('');
  const [searchError, setSearchError] = useState('');
  const [searchSuccess, setSearchSuccess] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [copiedHandle, setCopiedHandle] = useState(false);
  const [copiedCodeId, setCopiedCodeId] = useState<string | null>(null);

  const [myProfile, setMyProfile] = useState<PeerProfile | null>(null);
  const [peers, setPeers] = useState<PeerProfile[]>([]);
  const [peerStats, setPeerStats] = useState<Record<string, PeerStats>>({});
  const [myStats, setMyStats] = useState<PeerStats>({
    totalFocusMinutes: 0,
    todayFocusMinutes: 0,
    subjectBreakdown: {},
    questionsAttempted: 0,
    accuracy: 0,
    streakDays: 1
  });

  const [receivedRequests, setReceivedRequests] = useState<PeerRequest[]>([]);
  const [sentRequests, setSentRequests] = useState<PeerRequest[]>([]);

  // Privacy & Stats Sharing States
  const [privacyScope, setPrivacyScope] = useState<'public' | 'buddies' | 'private'>(() => {
    const saved = localStorage.getItem('ca_peer_privacy_scope');
    return (saved === 'public' || saved === 'buddies' || saved === 'private') ? saved : 'public';
  });
  const [shareHours, setShareHours] = useState<boolean>(() => {
    const saved = localStorage.getItem('ca_peer_share_hours');
    return saved !== null ? saved === 'true' : true;
  });
  const [shareAccuracy, setShareAccuracy] = useState<boolean>(() => {
    const saved = localStorage.getItem('ca_peer_share_accuracy');
    return saved !== null ? saved === 'true' : true;
  });
  const [shareStreak, setShareStreak] = useState<boolean>(() => {
    const saved = localStorage.getItem('ca_peer_share_streak');
    return saved !== null ? saved === 'true' : true;
  });
  const [studyStatus, setStudyStatus] = useState<string>(() => {
    return localStorage.getItem('ca_peer_study_status') || 'Available to Clear Doubts';
  });
  const [savingPrivacy, setSavingPrivacy] = useState(false);

  // Secured Chat States
  const [selectedChatTarget, setSelectedChatTarget] = useState<string>('group_lounge');
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [messageInput, setMessageInput] = useState('');
  const [composerMode, setComposerMode] = useState<'chat' | 'doubt' | 'request'>('chat');
  const [composerSubject, setComposerSubject] = useState<string>('FR');
  const [composerChapter, setComposerChapter] = useState<string>('');
  const [chatFilter, setChatFilter] = useState<'all' | 'doubt' | 'request' | 'unresolved'>('all');
  const [channelSearch, setChannelSearch] = useState('');
  const chatScrollRef = useRef<HTMLDivElement>(null);

  // Group Study Rooms States
  const [customRooms, setCustomRooms] = useState<StudyRoom[]>(() => {
    try {
      const saved = localStorage.getItem('ca_custom_study_rooms');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [unlockedRoomIds, setUnlockedRoomIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('ca_unlocked_room_ids');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [roomSubjectFilter, setRoomSubjectFilter] = useState<string>('ALL');
  const [showCreateRoomModal, setShowCreateRoomModal] = useState(false);
  const [newRoomName, setNewRoomName] = useState('');
  const [newRoomSubject, setNewRoomSubject] = useState<string>('FR');
  const [newRoomTopic, setNewRoomTopic] = useState('');
  const [newRoomPrivate, setNewRoomPrivate] = useState(false);

  const [showJoinByCodeModal, setShowJoinByCodeModal] = useState(false);
  const [inviteCodeInput, setInviteCodeInput] = useState('');
  const [inviteCodeError, setInviteCodeError] = useState('');

  // Global Dashboard States
  const [globalCohortUsers, setGlobalCohortUsers] = useState<PeerProfile[]>([]);
  const [dashboardScope, setDashboardScope] = useState<'global' | 'buddies'>('global');
  const [leaderboardSortBy, setLeaderboardSortBy] = useState<'today' | 'total' | 'accuracy' | 'streak'>('today');
  const [communityDoubts, setCommunityDoubts] = useState<Array<ChatMessage & { channelId: string; channelName: string }>>([]);

  // Custom Username Registry & Claim States
  const [showUsernameModal, setShowUsernameModal] = useState(false);
  const [customHandleDraft, setCustomHandleDraft] = useState('');
  const [handleAvailabilityState, setHandleAvailabilityState] = useState<
    'idle' | 'checking' | 'available' | 'taken' | 'invalid' | 'current'
  >('idle');
  const [handleAvailabilityMsg, setHandleAvailabilityMsg] = useState('');
  const [isClaimingHandle, setIsClaimingHandle] = useState(false);
  const [claimHandleSuccess, setClaimHandleSuccess] = useState('');
  const [registeredUsernames, setRegisteredUsernames] = useState<UsernameRegistryItem[]>([]);
  const [registrySearchFilter, setRegistrySearchFilter] = useState('');

  const user = auth.currentUser;

  // All available group rooms (default + custom)
  const allStudyRooms = useMemo(() => {
    const map = new Map<string, StudyRoom>();
    DEFAULT_STUDY_ROOMS.forEach(r => map.set(r.id, r));
    customRooms.forEach(r => map.set(r.id, r));
    return Array.from(map.values());
  }, [customRooms]);

  // Helper to compute streak days from timestamps
  const calculateStreakDays = (timestamps: string[]): number => {
    if (!timestamps.length) return 0;
    const uniqueDays = Array.from(
      new Set(
        timestamps
          .map(ts => (ts ? ts.slice(0, 10) : ''))
          .filter(Boolean)
      )
    ).sort().reverse();
    if (!uniqueDays.length) return 0;

    const todayStr = new Date().toISOString().slice(0, 10);
    const yesterdayStr = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
    if (uniqueDays[0] !== todayStr && uniqueDays[0] !== yesterdayStr) {
      return 1;
    }
    let streak = 1;
    for (let i = 0; i < uniqueDays.length - 1; i++) {
      const curr = new Date(uniqueDays[i]);
      const next = new Date(uniqueDays[i + 1]);
      const diffDays = Math.round((curr.getTime() - next.getTime()) / 86400000);
      if (diffDays === 1) {
        streak++;
      } else {
        break;
      }
    }
    return streak;
  };

  // Load current user profile, peer requests, and connected peers
  useEffect(() => {
    if (!user) return;

    const myDocRef = doc(db, 'users', user.uid);
    const unsubProfile = onSnapshot(
      myDocRef,
      docSnap => {
        if (docSnap.exists()) {
          const data = docSnap.data();
          let handle = normalizeUsername(data.studentHandle || '');
          const dispHandle = cleanDisplayUsername(data.displayHandle || data.studentHandle || '');
          if (!handle) {
            handle = `${(user.displayName || 'student').toLowerCase().replace(/[^a-z0-9]/g, '')}_${user.uid.slice(0, 4)}`.slice(0, 24);
            setDoc(
              myDocRef,
              {
                studentHandle: handle,
                displayHandle: handle,
                uid: user.uid,
                displayName: data.displayName || user.displayName || 'CA Finalist',
                emote: data.emote || 'GraduationCap',
                coursePreference: data.coursePreference || 'Both Groups',
                updatedAt: new Date().toISOString()
              },
              { merge: true }
            ).catch(err => handleFirestoreError(err, OperationType.WRITE, `users/${user.uid}`));
          }
          ensureDefaultUsernameRegistered(
            user.uid,
            dispHandle || handle,
            data.displayName || user.displayName || 'CA Finalist'
          ).catch(() => {});

          if (data.privacyScope) setPrivacyScope(data.privacyScope);
          if (typeof data.shareHours === 'boolean') setShareHours(data.shareHours);
          if (typeof data.shareAccuracy === 'boolean') setShareAccuracy(data.shareAccuracy);
          if (typeof data.shareStreak === 'boolean') setShareStreak(data.shareStreak);
          if (data.studyStatus) setStudyStatus(data.studyStatus);

          setMyProfile({
            uid: user.uid,
            studentHandle: handle,
            displayHandle: dispHandle || handle,
            displayName: data.displayName || user.displayName || 'CA Finalist',
            emote: data.emote || 'GraduationCap',
            coursePreference: data.coursePreference || 'Both Groups',
            motto: data.motto || 'Targeting Exemption in all 6 Papers',
            studyStatus: data.studyStatus || 'Available to Clear Doubts',
            dailyGoalMinutes: data.dailyGoalMinutes || 360,
            privacyScope: data.privacyScope || 'public',
            shareHours: typeof data.shareHours === 'boolean' ? data.shareHours : true,
            shareAccuracy: typeof data.shareAccuracy === 'boolean' ? data.shareAccuracy : true,
            shareStreak: typeof data.shareStreak === 'boolean' ? data.shareStreak : true,
            todayFocusMinutes: data.todayFocusMinutes || 0,
            totalFocusMinutes: data.totalFocusMinutes || 0,
            practiceAccuracy: data.practiceAccuracy || 0,
            practiceQuestionsCount: data.practiceQuestionsCount || 0,
            studyStreakDays: data.studyStreakDays || 1
          });
        } else {
          const handle = `${(user.displayName || 'student').toLowerCase().replace(/[^a-z0-9]/g, '')}_${user.uid.slice(0, 4)}`.slice(0, 24);
          const newProfile: PeerProfile = {
            uid: user.uid,
            studentHandle: handle,
            displayHandle: handle,
            displayName: user.displayName || 'CA Finalist',
            emote: 'GraduationCap',
            coursePreference: 'Both Groups',
            studyStatus: 'Available to Clear Doubts',
            dailyGoalMinutes: 360,
            privacyScope: 'public',
            shareHours: true,
            shareAccuracy: true,
            shareStreak: true
          };
          setDoc(
            myDocRef,
            { ...newProfile, darkMode: true, updatedAt: new Date().toISOString() },
            { merge: true }
          ).catch(err => handleFirestoreError(err, OperationType.WRITE, `users/${user.uid}`));
          ensureDefaultUsernameRegistered(user.uid, handle, newProfile.displayName).catch(() => {});
          setMyProfile(newProfile);
        }
      },
      err => handleFirestoreError(err, OperationType.GET, `users/${user.uid}`)
    );

    // Real-time listener on /usernames registry
    const usernamesQuery = query(collection(db, 'usernames'), limit(200));
    const unsubUsernames = onSnapshot(
      usernamesQuery,
      snap => {
        const list: UsernameRegistryItem[] = [];
        snap.forEach(d => list.push(d.data() as UsernameRegistryItem));
        list.sort((a, b) => (a.normalizedHandle || '').localeCompare(b.normalizedHandle || ''));
        setRegisteredUsernames(list);
      },
      () => {
        fetchRegisteredUsernames().then(setRegisteredUsernames).catch(() => {});
      }
    );

    // Incoming requests
    const qRec = query(
      collection(db, 'peerRequests'),
      where('toUserId', '==', user.uid),
      where('status', '==', 'pending')
    );
    const unsubRec = onSnapshot(
      qRec,
      snap => {
        const list: PeerRequest[] = [];
        snap.forEach(d => list.push({ id: d.id, ...(d.data() as Omit<PeerRequest, 'id'>) }));
        setReceivedRequests(list);
      },
      err => handleFirestoreError(err, OperationType.LIST, 'peerRequests')
    );

    // Sent requests
    const qSent = query(
      collection(db, 'peerRequests'),
      where('fromUserId', '==', user.uid),
      where('status', '==', 'pending')
    );
    const unsubSent = onSnapshot(
      qSent,
      snap => {
        const list: PeerRequest[] = [];
        snap.forEach(d => list.push({ id: d.id, ...(d.data() as Omit<PeerRequest, 'id'>) }));
        setSentRequests(list);
      },
      err => handleFirestoreError(err, OperationType.LIST, 'peerRequests')
    );

    // Connected Peers
    const peersRef = collection(db, 'users', user.uid, 'peers');
    const unsubPeers = onSnapshot(
      peersRef,
      snap => {
        const list: PeerProfile[] = [];
        snap.forEach(d => list.push(d.data() as PeerProfile));
        setPeers(list);
      },
      err => handleFirestoreError(err, OperationType.LIST, `users/${user.uid}/peers`)
    );

    // Listen to custom study rooms in Firestore
    const roomsRef = query(collection(db, 'studyRooms'), limit(50));
    const unsubRooms = onSnapshot(
      roomsRef,
      snap => {
        const list: StudyRoom[] = [];
        snap.forEach(d => list.push(d.data() as StudyRoom));
        list.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
        setCustomRooms(list);
        localStorage.setItem('ca_custom_study_rooms', JSON.stringify(list));
      },
      () => {
        // Fallback to localStorage if offline
      }
    );

    // Listen to global users for Global Dashboard
    const usersRef = query(collection(db, 'users'), limit(100));
    const unsubUsers = onSnapshot(
      usersRef,
      snap => {
        const list: PeerProfile[] = [];
        snap.forEach(d => {
          const data = d.data();
          if (data && (data.uid || d.id)) {
            list.push({
              uid: data.uid || d.id,
              studentHandle: data.studentHandle || `ca_${d.id.slice(0, 5)}`,
              displayName: data.displayName || 'CA Finalist',
              emote: data.emote || 'GraduationCap',
              coursePreference: data.coursePreference || 'Both Groups',
              studyStatus: data.studyStatus || 'Studying CA Final',
              privacyScope: data.privacyScope || 'public',
              shareHours: typeof data.shareHours === 'boolean' ? data.shareHours : true,
              shareAccuracy: typeof data.shareAccuracy === 'boolean' ? data.shareAccuracy : true,
              shareStreak: typeof data.shareStreak === 'boolean' ? data.shareStreak : true,
              todayFocusMinutes: Number(data.todayFocusMinutes) || 0,
              totalFocusMinutes: Number(data.totalFocusMinutes) || 0,
              practiceAccuracy: Number(data.practiceAccuracy) || 0,
              practiceQuestionsCount: Number(data.practiceQuestionsCount) || 0,
              studyStreakDays: Number(data.studyStreakDays) || 0,
              lastActiveAt: data.updatedAt || ''
            });
          }
        });
        setGlobalCohortUsers(list);
      },
      err => handleFirestoreError(err, OperationType.LIST, 'users')
    );

    return () => {
      unsubProfile();
      unsubUsernames();
      unsubRec();
      unsubSent();
      unsubPeers();
      unsubRooms();
      unsubUsers();
    };
  }, [user]);

  // Debounced live availability check inside the Custom Username Modal
  useEffect(() => {
    if (!showUsernameModal || !user) return;
    const raw = customHandleDraft.trim();
    const format = validateUsernameFormat(raw);
    if (!format.valid) {
      setHandleAvailabilityState('invalid');
      setHandleAvailabilityMsg(format.error || 'Invalid username format.');
      return;
    }

    const currentNorm = normalizeUsername(myProfile?.studentHandle || '');
    if (format.normalized === currentNorm) {
      setHandleAvailabilityState('current');
      setHandleAvailabilityMsg(`@${format.display} is your current active username.`);
      return;
    }

    setHandleAvailabilityState('checking');
    setHandleAvailabilityMsg('Checking case-insensitive registry...');
    const timer = setTimeout(async () => {
      const res = await checkUsernameAvailability(raw, user.uid);
      if (res.isCurrentUsers) {
        setHandleAvailabilityState('current');
        setHandleAvailabilityMsg(`@${res.display} is your current active username.`);
      } else if (res.available) {
        setHandleAvailabilityState('available');
        setHandleAvailabilityMsg(`✓ @${res.display} is available! (First-Come, First-Served)`);
      } else {
        setHandleAvailabilityState('taken');
        setHandleAvailabilityMsg(res.reason || `@${res.normalized} is already taken.`);
      }
    }, 260);

    return () => clearTimeout(timer);
  }, [customHandleDraft, showUsernameModal, user, myProfile?.studentHandle]);

  const handleOpenUsernameModal = () => {
    setCustomHandleDraft(myProfile?.displayHandle || myProfile?.studentHandle || '');
    setClaimHandleSuccess('');
    setShowUsernameModal(true);
    fetchRegisteredUsernames().then(setRegisteredUsernames).catch(() => {});
  };

  const handleClaimCustomUsername = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !myProfile) return;
    setIsClaimingHandle(true);
    setClaimHandleSuccess('');

    const result = await claimCustomUsername({
      rawInput: customHandleDraft,
      currentUid: user.uid,
      currentDisplayName: myProfile.displayName,
      previousHandle: myProfile.studentHandle
    });

    setIsClaimingHandle(false);
    if (!result.success) {
      setHandleAvailabilityState('taken');
      setHandleAvailabilityMsg(result.error || 'Could not claim username.');
      return;
    }

    setMyProfile(prev =>
      prev
        ? {
            ...prev,
            studentHandle: result.normalizedHandle,
            displayHandle: result.displayHandle
          }
        : prev
    );
    setClaimHandleSuccess(
      `✓ Username @${result.displayHandle} is now locked to your account! Your previous handle was released.`
    );
    fetchRegisteredUsernames().then(setRegisteredUsernames).catch(() => {});
    setTimeout(() => {
      setShowUsernameModal(false);
      setClaimHandleSuccess('');
    }, 1200);
  };

  // Fetch & sync my stats and connected buddies' stats
  useEffect(() => {
    if (!user) return;

    const fetchUserStats = async (targetUid: string, isSelf: boolean) => {
      try {
        const todayStr = new Date().toISOString().split('T')[0];
        const focusSnap = await getDocs(collection(db, 'users', targetUid, 'focusSessions'));
        let totalFocus = 0;
        let todayFocus = 0;
        const breakdown: Record<string, number> = {};
        const allTimestamps: string[] = [];

        focusSnap.forEach(d => {
          const data = d.data();
          if (data.sessionType !== 'break') {
            const dur = Number(data.duration) || 0;
            totalFocus += dur;
            if (data.timestamp && data.timestamp.startsWith(todayStr)) {
              todayFocus += dur;
            }
            if (data.timestamp) allTimestamps.push(data.timestamp);
            const sub = data.subjectId || 'General';
            breakdown[sub] = (breakdown[sub] || 0) + dur;
          }
        });

        const attemptsSnap = await getDocs(collection(db, 'users', targetUid, 'practiceAttempts'));
        let qCount = 0;
        let correctCount = 0;
        attemptsSnap.forEach(d => {
          const data = d.data();
          qCount++;
          if (data.isCorrect) correctCount++;
          if (data.timestamp) allTimestamps.push(data.timestamp);
        });

        const acc = qCount > 0 ? Math.round((correctCount / qCount) * 100) : 0;
        const streak = Math.max(calculateStreakDays(allTimestamps), totalFocus > 0 || qCount > 0 ? 1 : 0);

        const statsObj: PeerStats = {
          totalFocusMinutes: totalFocus,
          todayFocusMinutes: todayFocus,
          subjectBreakdown: breakdown,
          questionsAttempted: qCount,
          accuracy: acc,
          streakDays: streak
        };

        if (isSelf) {
          setMyStats(statsObj);
          // Sync summary telemetry to /users/{uid} so Global & Buddy Dashboards stay up-to-date
          setDoc(
            doc(db, 'users', targetUid),
            {
              todayFocusMinutes: Math.min(todayFocus, 1440),
              totalFocusMinutes: Math.min(totalFocus, 500000),
              practiceAccuracy: Math.min(Math.max(acc, 0), 100),
              practiceQuestionsCount: qCount,
              studyStreakDays: streak,
              updatedAt: new Date().toISOString()
            },
            { merge: true }
          ).catch(() => {});
        } else {
          setPeerStats(prev => ({ ...prev, [targetUid]: statsObj }));
        }
      } catch {
        // Ignore if peer subcollection is restricted
      }
    };

    fetchUserStats(user.uid, true);
    peers.forEach(p => {
      fetchUserStats(p.uid, false);
    });
  }, [user, peers]);

  // Real-time Secured Chat listener for selected channel/room/peer
  useEffect(() => {
    if (!user) return;

    const chatId =
      selectedChatTarget === 'group_lounge' ||
      selectedChatTarget.startsWith('circle_') ||
      selectedChatTarget.startsWith('room_')
        ? selectedChatTarget
        : [user.uid, selectedChatTarget].sort().join('_');

    const messagesRef = collection(db, 'peerChats', chatId, 'messages');
    const q = query(messagesRef, limit(120));

    const unsub = onSnapshot(
      q,
      snap => {
        const msgs: ChatMessage[] = [];
        snap.forEach(d => msgs.push(d.data() as ChatMessage));
        msgs.sort((a, b) => a.timestamp.localeCompare(b.timestamp));
        setChatMessages(msgs);
        setTimeout(() => {
          if (chatScrollRef.current) {
            chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight;
          }
        }, 60);
      },
      err => handleFirestoreError(err, OperationType.LIST, `peerChats/${chatId}/messages`)
    );

    return () => unsub();
  }, [user, selectedChatTarget]);

  // Load recent community doubts/requests across channels for the Global Dashboard
  useEffect(() => {
    if (!user || activeTab !== 'global') return;
    let isMounted = true;

    const loadCommunityDoubts = async () => {
      const channels = [
        { id: 'group_lounge', name: 'General Study Lounge' },
        ...SUBJECT_CIRCLES.map(c => ({ id: c.id, name: `${c.subjectId} Circle` }))
      ];
      const collected: Array<ChatMessage & { channelId: string; channelName: string }> = [];

      for (const ch of channels) {
        try {
          const snap = await getDocs(query(collection(db, 'peerChats', ch.id, 'messages'), limit(35)));
          snap.forEach(d => {
            const data = d.data() as ChatMessage;
            const isStructuredDoubt =
              data.msgType === 'doubt' ||
              data.msgType === 'request' ||
              data.text.startsWith('[DOUBT]') ||
              data.text.startsWith('[REQUEST]');
            if (isStructuredDoubt) {
              collected.push({ ...data, channelId: ch.id, channelName: ch.name });
            }
          });
        } catch {
          // Ignore individual channel errors
        }
      }
      if (isMounted) {
        collected.sort((a, b) => b.timestamp.localeCompare(a.timestamp));
        setCommunityDoubts(collected.slice(0, 15));
      }
    };

    loadCommunityDoubts();
    return () => {
      isMounted = false;
    };
  }, [user, activeTab]);

  // Save privacy settings to Firestore & localStorage
  const handleSavePrivacySettings = async (
    nextScope: 'public' | 'buddies' | 'private',
    nextHours: boolean,
    nextAccuracy: boolean,
    nextStreak: boolean,
    nextStatus: string
  ) => {
    setPrivacyScope(nextScope);
    setShareHours(nextHours);
    setShareAccuracy(nextAccuracy);
    setShareStreak(nextStreak);
    setStudyStatus(nextStatus);

    localStorage.setItem('ca_peer_privacy_scope', nextScope);
    localStorage.setItem('ca_peer_share_hours', String(nextHours));
    localStorage.setItem('ca_peer_share_accuracy', String(nextAccuracy));
    localStorage.setItem('ca_peer_share_streak', String(nextStreak));
    localStorage.setItem('ca_peer_study_status', nextStatus);

    if (!user) return;
    setSavingPrivacy(true);
    try {
      await setDoc(
        doc(db, 'users', user.uid),
        {
          privacyScope: nextScope,
          shareHours: nextHours,
          shareAccuracy: nextAccuracy,
          shareStreak: nextStreak,
          studyStatus: nextStatus,
          updatedAt: new Date().toISOString()
        },
        { merge: true }
      );
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, `users/${user.uid}`);
    } finally {
      setSavingPrivacy(false);
    }
  };

  // Send Chat / Doubt Request / Material Request Message
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageInput.trim() || !user || !myProfile) return;

    const chatId =
      selectedChatTarget === 'group_lounge' ||
      selectedChatTarget.startsWith('circle_') ||
      selectedChatTarget.startsWith('room_')
        ? selectedChatTarget
        : [user.uid, selectedChatTarget].sort().join('_');

    const msgId = `${Date.now()}_${user.uid.slice(0, 5)}`;
    const msgRef = doc(db, 'peerChats', chatId, 'messages', msgId);

    const payload: ChatMessage = {
      id: msgId,
      senderId: user.uid,
      senderName: myProfile.displayName,
      senderEmote: myProfile.emote || 'GraduationCap',
      receiverId: selectedChatTarget,
      text: messageInput.trim(),
      timestamp: new Date().toISOString(),
      msgType: composerMode,
      ...(composerMode !== 'chat' ? { subjectTag: composerSubject } : {}),
      ...(composerMode !== 'chat' && composerChapter.trim()
        ? { chapterTag: composerChapter.trim().slice(0, 120) }
        : {}),
      ...(composerMode !== 'chat' ? { isResolved: false } : {})
    };

    setMessageInput('');
    setComposerChapter('');
    if (composerMode !== 'chat') {
      setComposerMode('chat');
    }

    try {
      await setDoc(msgRef, payload);
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, `peerChats/${chatId}/messages/${msgId}`);
    }
  };

  // Toggle Resolved state on a Doubt or Material Request
  const handleToggleResolveMessage = async (msg: ChatMessage, channelOverride?: string) => {
    if (!user || !myProfile) return;
    const targetChannel = channelOverride || selectedChatTarget;
    const chatId =
      targetChannel === 'group_lounge' ||
      targetChannel.startsWith('circle_') ||
      targetChannel.startsWith('room_')
        ? targetChannel
        : [user.uid, targetChannel].sort().join('_');

    const msgRef = doc(db, 'peerChats', chatId, 'messages', msg.id);
    const nextResolved = !msg.isResolved;
    try {
      await updateDoc(msgRef, {
        ...msg,
        isResolved: nextResolved,
        resolvedBy: nextResolved ? myProfile.displayName : ''
      });
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, `peerChats/${chatId}/messages/${msg.id}`);
    }
  };

  const handleDeleteMessage = async (msgId: string) => {
    if (!user) return;
    const chatId =
      selectedChatTarget === 'group_lounge' ||
      selectedChatTarget.startsWith('circle_') ||
      selectedChatTarget.startsWith('room_')
        ? selectedChatTarget
        : [user.uid, selectedChatTarget].sort().join('_');

    try {
      await deleteDoc(doc(db, 'peerChats', chatId, 'messages', msgId));
    } catch (err) {
      handleFirestoreError(err, OperationType.DELETE, `peerChats/${chatId}/messages/${msgId}`);
    }
  };

  // Create a new Group Study Room
  const handleCreateStudyRoom = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRoomName.trim() || !user || !myProfile) return;

    const roomId = `room_${Date.now()}_${user.uid.slice(0, 4)}`;
    const generatedCode = newRoomPrivate
      ? `RM-${Math.random().toString(36).substring(2, 6).toUpperCase()}`
      : '';

    const roomObj: StudyRoom = {
      id: roomId,
      name: newRoomName.trim().slice(0, 120),
      subjectId: newRoomSubject,
      topic: (newRoomTopic.trim() || `${newRoomSubject} Collaborative Doubt & Revision Room`).slice(0, 300),
      isPrivate: newRoomPrivate,
      ...(newRoomPrivate ? { inviteCode: generatedCode } : {}),
      creatorId: user.uid,
      creatorName: myProfile.displayName,
      memberIds: [user.uid],
      createdAt: new Date().toISOString()
    };

    try {
      await setDoc(doc(db, 'studyRooms', roomId), roomObj);
    } catch {
      // Also store locally so it works immediately
      const updated = [roomObj, ...customRooms];
      setCustomRooms(updated);
      localStorage.setItem('ca_custom_study_rooms', JSON.stringify(updated));
    }

    if (newRoomPrivate) {
      const nextUnlocked = Array.from(new Set([...unlockedRoomIds, roomId]));
      setUnlockedRoomIds(nextUnlocked);
      localStorage.setItem('ca_unlocked_room_ids', JSON.stringify(nextUnlocked));
    }

    setNewRoomName('');
    setNewRoomTopic('');
    setNewRoomPrivate(false);
    setShowCreateRoomModal(false);
    setSelectedChatTarget(roomId);
    setActiveTab('chat');
  };

  // Join a Private Room by Invite Code
  const handleJoinRoomByCode = (e: React.FormEvent) => {
    e.preventDefault();
    setInviteCodeError('');
    const cleanCode = inviteCodeInput.trim().toUpperCase();
    if (!cleanCode) {
      setInviteCodeError('Please enter a valid room invite code (e.g., RM-4829).');
      return;
    }

    const matchedRoom = allStudyRooms.find(
      r => r.isPrivate && r.inviteCode && r.inviteCode.toUpperCase() === cleanCode
    );
    if (!matchedRoom) {
      setInviteCodeError('No private room found matching that invite code.');
      return;
    }

    const nextUnlocked = Array.from(new Set([...unlockedRoomIds, matchedRoom.id]));
    setUnlockedRoomIds(nextUnlocked);
    localStorage.setItem('ca_unlocked_room_ids', JSON.stringify(nextUnlocked));
    setInviteCodeInput('');
    setShowJoinByCodeModal(false);
    setSelectedChatTarget(matchedRoom.id);
    setActiveTab('chat');
  };

  const handleDeleteRoom = async (roomId: string) => {
    if (!user) return;
    try {
      await deleteDoc(doc(db, 'studyRooms', roomId));
    } catch {
      const filtered = customRooms.filter(r => r.id !== roomId);
      setCustomRooms(filtered);
      localStorage.setItem('ca_custom_study_rooms', JSON.stringify(filtered));
    }
    if (selectedChatTarget === roomId) {
      setSelectedChatTarget('group_lounge');
    }
  };

  // Send Buddy Request by Handle or UID
  const handleSendPeerRequest = async (targetProfileOverride?: PeerProfile) => {
    setSearchError('');
    setSearchSuccess('');
    if (!user || !myProfile) return;

    if (targetProfileOverride) {
      if (targetProfileOverride.uid === user.uid) return;
      if (peers.some(p => p.uid === targetProfileOverride.uid)) {
        setSearchSuccess(`Already connected with ${targetProfileOverride.displayName}`);
        return;
      }
      const reqId = `${user.uid}_${targetProfileOverride.uid}`;
      try {
        await setDoc(doc(db, 'peerRequests', reqId), {
          fromUserId: user.uid,
          fromUserHandle: myProfile.studentHandle,
          fromUserName: myProfile.displayName,
          fromUserEmote: myProfile.emote || 'GraduationCap',
          toUserId: targetProfileOverride.uid,
          toUserHandle: targetProfileOverride.studentHandle || targetProfileOverride.uid.slice(0, 6),
          toUserName: targetProfileOverride.displayName || 'CA Finalist',
          status: 'pending',
          timestamp: new Date().toISOString()
        });
        setSearchSuccess(`Buddy request sent to ${targetProfileOverride.displayName}!`);
      } catch (err) {
        handleFirestoreError(err, OperationType.WRITE, 'peerRequests');
      }
      return;
    }

    const cleanHandle = normalizeUsername(searchHandle);
    if (!cleanHandle) return;
    if (cleanHandle === normalizeUsername(myProfile.studentHandle) || cleanHandle === user.uid.toLowerCase()) {
      setSearchError("You cannot send a buddy request to your own handle.");
      return;
    }
    if (peers.some(p => normalizeUsername(p.studentHandle) === cleanHandle || p.uid.toLowerCase() === cleanHandle)) {
      setSearchError('This student is already in your Connected Buddies list.');
      return;
    }

    setIsSearching(true);
    try {
      let targetUser: (PeerProfile & { uid: string }) | null = null;

      // 1. Check canonical case-insensitive /usernames/{cleanHandle} registry first
      const regSnap = await getDoc(doc(db, 'usernames', cleanHandle));
      if (regSnap.exists()) {
        const regData = regSnap.data() as UsernameRegistryItem;
        const userDocSnap = await getDoc(doc(db, 'users', regData.uid));
        if (userDocSnap.exists()) {
          targetUser = { ...(userDocSnap.data() as PeerProfile), uid: regData.uid };
        } else {
          targetUser = {
            uid: regData.uid,
            studentHandle: regData.normalizedHandle,
            displayHandle: regData.displayHandle,
            displayName: regData.displayName || 'CA Finalist',
            emote: 'GraduationCap',
            coursePreference: 'Both Groups'
          };
        }
      }

      // 2. Fallback to /users query if not in /usernames yet
      if (!targetUser) {
        const usersRef = collection(db, 'users');
        const qHandle = query(usersRef, where('studentHandle', '==', cleanHandle));
        const snap = await getDocs(qHandle);

        if (!snap.empty) {
          const d = snap.docs[0];
          targetUser = { ...(d.data() as PeerProfile), uid: d.id };
        } else {
          const allSnap = await getDocs(query(usersRef, limit(150)));
          allSnap.forEach(d => {
            const data = d.data();
            if (
              d.id.toLowerCase() === cleanHandle ||
              normalizeUsername(data.studentHandle || data.displayHandle || '') === cleanHandle
            ) {
              targetUser = { ...(data as PeerProfile), uid: d.id };
            }
          });
        }
      }

      if (!targetUser) {
        setSearchError('No student found with that @handle or UID.');
        setIsSearching(false);
        return;
      }

      const reqId = `${user.uid}_${targetUser.uid}`;
      await setDoc(doc(db, 'peerRequests', reqId), {
        fromUserId: user.uid,
        fromUserHandle: myProfile.studentHandle,
        fromUserName: myProfile.displayName,
        fromUserEmote: myProfile.emote || 'GraduationCap',
        toUserId: targetUser.uid,
        toUserHandle: targetUser.studentHandle || cleanHandle,
        toUserName: targetUser.displayName || 'CA Finalist',
        status: 'pending',
        timestamp: new Date().toISOString()
      });

      setSearchSuccess(`Buddy request sent to @${targetUser.studentHandle || cleanHandle}!`);
      setSearchHandle('');
    } catch (err) {
      setSearchError('Failed to send request. Please verify the handle.');
      handleFirestoreError(err, OperationType.WRITE, 'peerRequests');
    } finally {
      setIsSearching(false);
    }
  };

  const handleAcceptRequest = async (req: PeerRequest) => {
    if (!user || !myProfile) return;
    try {
      await updateDoc(doc(db, 'peerRequests', req.id), { status: 'accepted' });
      const now = new Date().toISOString();

      await setDoc(doc(db, 'users', user.uid, 'peers', req.fromUserId), {
        uid: req.fromUserId,
        studentHandle: req.fromUserHandle,
        displayName: req.fromUserName,
        emote: req.fromUserEmote || 'GraduationCap',
        coursePreference: 'Both Groups',
        addedAt: now
      });

      await setDoc(doc(db, 'users', req.fromUserId, 'peers', user.uid), {
        uid: user.uid,
        studentHandle: myProfile.studentHandle,
        displayName: myProfile.displayName,
        emote: myProfile.emote || 'GraduationCap',
        coursePreference: myProfile.coursePreference || 'Both Groups',
        addedAt: now
      });
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, `users/${user.uid}/peers`);
    }
  };

  const handleDeclineOrCancelRequest = async (reqId: string) => {
    try {
      await deleteDoc(doc(db, 'peerRequests', reqId));
    } catch (err) {
      handleFirestoreError(err, OperationType.DELETE, `peerRequests/${reqId}`);
    }
  };

  const handleRemovePeer = async (peerUid: string) => {
    if (!user) return;
    try {
      await deleteDoc(doc(db, 'users', user.uid, 'peers', peerUid));
      await deleteDoc(doc(db, 'users', peerUid, 'peers', user.uid));
      if (selectedChatTarget === peerUid) {
        setSelectedChatTarget('group_lounge');
      }
    } catch (err) {
      handleFirestoreError(err, OperationType.DELETE, `users/${user.uid}/peers/${peerUid}`);
    }
  };

  const formatHours = (mins: number) => {
    const h = Math.floor(mins / 60);
    const m = Math.round(mins % 60);
    if (h === 0) return `${m}m`;
    return `${h}h ${m}m`;
  };

  // Resolve current chat channel metadata
  const activeChannelMeta = useMemo(() => {
    if (selectedChatTarget === 'group_lounge') {
      return {
        type: 'lounge' as const,
        title: 'General CA Final Study Lounge',
        subtitle: 'Open community coordination, quick doubts & study material exchange',
        badge: 'PUBLIC CHANNEL',
        subjectId: 'ALL'
      };
    }
    if (selectedChatTarget.startsWith('circle_')) {
      const circle = SUBJECT_CIRCLES.find(c => c.id === selectedChatTarget);
      return {
        type: 'circle' as const,
        title: circle ? circle.name : 'Subject Study Circle',
        subtitle: circle ? circle.description : 'Subject-specific statutory discussion',
        badge: circle ? `${circle.paperNo} • ${circle.subjectId}` : 'SUBJECT CIRCLE',
        subjectId: circle?.subjectId || 'FR'
      };
    }
    if (selectedChatTarget.startsWith('room_')) {
      const room = allStudyRooms.find(r => r.id === selectedChatTarget);
      return {
        type: 'room' as const,
        title: room ? room.name : 'Group Study Room',
        subtitle: room ? room.topic : 'Student group study room',
        badge: room?.isPrivate ? `PRIVATE ROOM • ${room.inviteCode || 'LOCKED'}` : `GROUP ROOM • ${room?.subjectId || 'General'}`,
        subjectId: room?.subjectId || 'FR',
        inviteCode: room?.inviteCode
      };
    }
    const peer = peers.find(p => p.uid === selectedChatTarget);
    return {
      type: 'direct' as const,
      title: peer ? peer.displayName : 'Direct Peer Chat',
      subtitle: peer ? `@${peer.studentHandle} • Direct 1-on-1 Secured Peer Thread` : '1-on-1 Direct Peer Thread',
      badge: 'E2E SECURED 1-ON-1',
      subjectId: 'FR'
    };
  }, [selectedChatTarget, allStudyRooms, peers]);

  // Filtered messages in the active chat stream
  const filteredChatMessages = useMemo(() => {
    return chatMessages.filter(m => {
      if (chatFilter === 'all') return true;
      const isDoubt = m.msgType === 'doubt' || m.text.startsWith('[DOUBT]');
      const isReq = m.msgType === 'request' || m.text.startsWith('[REQUEST]');
      if (chatFilter === 'doubt') return isDoubt;
      if (chatFilter === 'request') return isReq;
      if (chatFilter === 'unresolved') return (isDoubt || isReq) && !m.isResolved;
      return true;
    });
  }, [chatMessages, chatFilter]);

  // Build Leaderboard rows for Global Dashboard (or My Buddies scope)
  const leaderboardEntries = useMemo(() => {
    const buddyUidSet = new Set(peers.map(p => p.uid));
    const sourceList: PeerProfile[] = [];

    if (dashboardScope === 'global') {
      globalCohortUsers.forEach(u => {
        const isSelf = user && u.uid === user.uid;
        const isBuddy = buddyUidSet.has(u.uid);
        const scope = isSelf ? privacyScope : (u.privacyScope || 'public');
        // Include if self, or public, or buddy with 'buddies' scope
        if (isSelf || scope === 'public' || (isBuddy && scope === 'buddies')) {
          sourceList.push(u);
        }
      });
      if (user && myProfile && !sourceList.some(u => u.uid === user.uid)) {
        sourceList.push(myProfile);
      }
    } else {
      if (myProfile) sourceList.push(myProfile);
      peers.forEach(p => {
        const globalMatch = globalCohortUsers.find(g => g.uid === p.uid);
        sourceList.push(globalMatch ? { ...p, ...globalMatch } : p);
      });
    }

    const enriched = sourceList.map(u => {
      const isSelf = Boolean(user && u.uid === user.uid);
      const isBuddy = buddyUidSet.has(u.uid);
      const subStats = isSelf ? myStats : peerStats[u.uid];

      const canViewHours = isSelf ? true : (u.shareHours !== false);
      const canViewAccuracy = isSelf ? true : (u.shareAccuracy !== false);
      const canViewStreak = isSelf ? true : (u.shareStreak !== false);

      const todayMins = isSelf
        ? myStats.todayFocusMinutes
        : (subStats?.todayFocusMinutes ?? u.todayFocusMinutes ?? 0);
      const totalMins = isSelf
        ? myStats.totalFocusMinutes
        : (subStats?.totalFocusMinutes ?? u.totalFocusMinutes ?? 0);
      const accuracy = isSelf
        ? myStats.accuracy
        : (subStats?.accuracy ?? u.practiceAccuracy ?? 0);
      const streak = isSelf
        ? myStats.streakDays
        : (subStats?.streakDays ?? u.studyStreakDays ?? 0);

      return {
        ...u,
        isSelf,
        isBuddy,
        canViewHours,
        canViewAccuracy,
        canViewStreak,
        todayMins: canViewHours ? todayMins : -1,
        totalMins: canViewHours ? totalMins : -1,
        accuracy: canViewAccuracy ? accuracy : -1,
        streak: canViewStreak ? streak : -1
      };
    });

    enriched.sort((a, b) => {
      if (leaderboardSortBy === 'today') return b.todayMins - a.todayMins;
      if (leaderboardSortBy === 'total') return b.totalMins - a.totalMins;
      if (leaderboardSortBy === 'accuracy') return b.accuracy - a.accuracy;
      return b.streak - a.streak;
    });

    return enriched;
  }, [
    dashboardScope,
    globalCohortUsers,
    peers,
    user,
    myProfile,
    privacyScope,
    myStats,
    peerStats,
    leaderboardSortBy
  ]);

  if (!user) {
    return (
      <div className="p-8 text-center bg-slate-900/90 rounded-2xl border border-slate-800">
        <Users className="w-12 h-12 text-amber-400 mx-auto mb-3 opacity-85" />
        <h3 className="text-lg font-bold text-slate-100 mb-1">
          Sign In Required for Peer Lounge
        </h3>
        <p className="text-sm text-slate-400 max-w-md mx-auto">
          Please sign in with your Google account to access secured student chats, subject doubt rooms, the Global Cohort Dashboard, and Buddy stats comparison.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3.5 w-full min-w-0 max-w-full overflow-x-hidden text-slate-100">
      {/* Compact Command Header & 4-Tab Navigation Bar (Locked & Scroll-Diminished) */}
      <div className="locked-internal-header">
      <div className="locked-internal-header-card bg-gradient-to-r from-[#0e203d] via-[#152b4f] to-[#192844] rounded-2xl px-5 py-5 sm:px-7 sm:py-6 border border-indigo-400/55 ring-1 ring-white/[0.06] relative overflow-hidden">
        {/* Top Luminous Indigo-Sky-Amber Hairline */}
        <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-indigo-400 via-sky-400 to-amber-400 opacity-90 pointer-events-none" />
        <div className="absolute -top-10 right-16 w-48 h-20 bg-indigo-400/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-3.5">
          <div className="min-w-0 space-y-1.5">
            <div className="flex flex-wrap items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-indigo-400/30 to-sky-500/15 border border-indigo-300/60 shadow-[0_0_14px_rgba(99,102,241,0.28)] flex items-center justify-center shrink-0">
                <Users className="w-5 h-5 text-indigo-200" />
              </div>
              <h1 className="text-xl sm:text-2xl font-display font-black tracking-tight text-white drop-shadow-xs">
                Peer Lounge
              </h1>
              <span className="px-2.5 py-0.5 rounded-md bg-emerald-500/18 border border-emerald-400/45 text-[10.5px] font-mono font-extrabold text-emerald-300">
                {privacyScope === 'public'
                  ? 'Public Opt-In'
                  : privacyScope === 'buddies'
                  ? 'Buddies Only'
                  : 'Private'}
              </span>
            </div>
            <div className="header-diminish-hide flex flex-wrap items-center gap-2 text-[11px] font-mono text-slate-300/90">
              <span className="inline-flex items-center gap-1 text-amber-300 font-bold">
                <Shield className="w-3 h-3" />
                <span>Secured CA Final Study Cohort</span>
              </span>
              <span aria-hidden="true">·</span>
              <span className="text-slate-300 truncate">{studyStatus}</span>
            </div>
          </div>

          {/* My Handle Compact Pill with Custom Username Claim Button */}
          {myProfile && (
            <div className="flex flex-wrap items-center justify-between sm:justify-start gap-2 bg-[#061322]/90 px-3 py-1.5 rounded-xl border border-amber-400/40 shadow-inner w-full lg:w-auto shrink-0">
              <div className="min-w-0 mr-1">
                <div className="header-diminish-hide text-[9px] font-mono font-extrabold uppercase tracking-wider text-slate-400">
                  My Unique @UserID
                </div>
                <div className="text-xs sm:text-sm font-mono font-extrabold text-amber-300 truncate">
                  @{myProfile.displayHandle || myProfile.studentHandle}
                </div>
              </div>
              <div className="flex items-center gap-1.5 shrink-0">
                <button
                  onClick={handleOpenUsernameModal}
                  className="header-diminish-btn inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-black bg-gradient-to-r from-amber-400 to-yellow-400 hover:from-amber-300 hover:to-yellow-300 text-slate-950 border border-amber-200 transition-all cursor-pointer whitespace-nowrap shrink-0 shadow-[0_0_12px_rgba(245,158,11,0.3)]"
                  title="Customize your unique @username (First-Come, First-Served)"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>Custom @ID</span>
                </button>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(`@${myProfile.displayHandle || myProfile.studentHandle}`);
                    setCopiedHandle(true);
                    setTimeout(() => setCopiedHandle(false), 2000);
                  }}
                  className="p-1.5 rounded-lg bg-[#0d2238] hover:bg-[#163252] text-amber-200 hover:text-white border border-amber-400/35 transition-colors cursor-pointer"
                  title="Copy Handle"
                >
                  {copiedHandle ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Unified 4-Tab Bar (Chat, Rooms, Global, Buddies) + Telemetry Strip */}
        <div className="relative z-10 header-diminish-row mt-2.5 pt-2 border-t border-slate-700/75 flex flex-col lg:flex-row lg:items-center justify-between gap-2.5">
          <div
            role="tablist"
            className="grid grid-cols-2 sm:flex sm:flex-wrap items-center gap-1.5 bg-[#061322]/90 p-1 rounded-xl border border-slate-700/80 shadow-inner w-full lg:w-auto"
          >
            <button
              role="tab"
              aria-selected={activeTab === 'chat'}
              onClick={() => setActiveTab('chat')}
              className={`header-diminish-btn flex items-center justify-center gap-1.5 px-2.5 sm:px-3.5 py-2 sm:py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap shrink-0 border ${
                activeTab === 'chat'
                  ? 'bg-gradient-to-r from-amber-400 to-yellow-400 text-slate-950 border-amber-200 font-black shadow-[0_0_12px_rgba(245,158,11,0.3)]'
                  : 'border-transparent text-slate-200 hover:text-white hover:bg-[#132944]'
              }`}
            >
              <MessageSquare
                className={`w-3.5 h-3.5 shrink-0 ${
                  activeTab === 'chat' ? 'text-slate-950' : 'text-amber-400'
                }`}
              />
              <span className="truncate">Chat & Doubts</span>
            </button>

            <button
              role="tab"
              aria-selected={activeTab === 'rooms'}
              onClick={() => setActiveTab('rooms')}
              className={`header-diminish-btn flex items-center justify-center gap-1.5 px-2.5 sm:px-3.5 py-2 sm:py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap shrink-0 tabular-nums border ${
                activeTab === 'rooms'
                  ? 'bg-gradient-to-r from-cyan-400 to-sky-400 text-slate-950 border-cyan-200 font-black shadow-[0_0_12px_rgba(6,182,212,0.3)]'
                  : 'border-transparent text-slate-200 hover:text-white hover:bg-[#132944]'
              }`}
            >
              <BookOpen
                className={`w-3.5 h-3.5 shrink-0 ${
                  activeTab === 'rooms' ? 'text-slate-950' : 'text-cyan-400'
                }`}
              />
              <span className="truncate">Study Rooms ({SUBJECT_CIRCLES.length + allStudyRooms.length})</span>
            </button>

            <button
              role="tab"
              aria-selected={activeTab === 'global'}
              onClick={() => setActiveTab('global')}
              className={`header-diminish-btn flex items-center justify-center gap-1.5 px-2.5 sm:px-3.5 py-2 sm:py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap shrink-0 border ${
                activeTab === 'global'
                  ? 'bg-gradient-to-r from-emerald-400 to-teal-400 text-slate-950 border-emerald-200 font-black shadow-[0_0_12px_rgba(16,185,129,0.3)]'
                  : 'border-transparent text-slate-200 hover:text-white hover:bg-[#132944]'
              }`}
            >
              <Globe
                className={`w-3.5 h-3.5 shrink-0 ${
                  activeTab === 'global' ? 'text-slate-950' : 'text-emerald-400'
                }`}
              />
              <span className="truncate">Global Cohort</span>
            </button>

            <button
              role="tab"
              aria-selected={activeTab === 'buddies'}
              onClick={() => setActiveTab('buddies')}
              className={`header-diminish-btn flex items-center justify-center gap-1.5 px-2.5 sm:px-3.5 py-2 sm:py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap shrink-0 tabular-nums border ${
                activeTab === 'buddies'
                  ? 'bg-gradient-to-r from-indigo-400 to-sky-400 text-slate-950 border-indigo-200 font-black shadow-[0_0_12px_rgba(99,102,241,0.3)]'
                  : 'border-transparent text-slate-200 hover:text-white hover:bg-[#132944]'
              }`}
            >
              <Users
                className={`w-3.5 h-3.5 shrink-0 ${
                  activeTab === 'buddies' ? 'text-slate-950' : 'text-sky-400'
                }`}
              />
              <span>
                Buddies & Privacy
                {receivedRequests.length > 0 ? ` (${receivedRequests.length} new)` : ''}
              </span>
            </button>
          </div>

          {/* Quick My Telemetry Summary Strip */}
          <div className="flex flex-wrap items-center gap-2 text-xs font-mono tabular-nums">
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-amber-500/15 border border-amber-400/40">
              <Clock className="w-3.5 h-3.5 text-amber-300" />
              <span className="text-[10.5px] text-amber-200/85">Today:</span>
              <span className="font-extrabold text-white">
                {formatHours(myStats.todayFocusMinutes)}
              </span>
            </div>
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-500/15 border border-emerald-400/40">
              <Award className="w-3.5 h-3.5 text-emerald-300" />
              <span className="text-[10.5px] text-emerald-200/85">Accuracy:</span>
              <span className="font-extrabold text-emerald-300">
                {myStats.accuracy}%
              </span>
            </div>
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-rose-500/15 border border-rose-400/40">
              <Flame className="w-3.5 h-3.5 text-rose-300" />
              <span className="text-[10.5px] text-rose-200/85">Streak:</span>
              <span className="font-extrabold text-amber-300">
                {myStats.streakDays}d
              </span>
            </div>
          </div>
        </div>
      </div>
      </div>

      {/* =====================================================================
          TAB 1: UNIFIED SPLIT-PANE SECURED CHAT & DOUBT CLEARING WORKSPACE
         ===================================================================== */}
      {activeTab === 'chat' && (
        <div className="bg-slate-900/90 rounded-2xl border border-slate-800 overflow-hidden grid grid-cols-1 lg:grid-cols-12 items-stretch min-w-0 shadow-sm">
          {/* Left Channel & Direct Thread Explorer Pane */}
          <div className="lg:col-span-4 xl:col-span-3 bg-[#0d1c2d] border-b lg:border-b-0 lg:border-r border-slate-800 flex flex-col min-w-0">
            <div className="p-3.5 border-b border-slate-800 space-y-2.5 bg-slate-900/60">
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-bold text-slate-300">
                  Secured Channels
                </span>
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => setShowCreateRoomModal(true)}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-bold bg-amber-500/15 text-amber-300 border border-amber-500/35 hover:bg-amber-500/25 transition-colors cursor-pointer whitespace-nowrap"
                    title="Create Group Study Room"
                  >
                    <Plus className="w-3 h-3" /> Room
                  </button>
                  <button
                    onClick={() => setShowJoinByCodeModal(true)}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-bold bg-slate-950 text-slate-300 border border-slate-800 hover:border-slate-700 hover:text-white transition-colors cursor-pointer whitespace-nowrap"
                    title="Enter Private Room Invite Code"
                  >
                    <KeyRound className="w-3 h-3 text-amber-400" /> Code
                  </button>
                </div>
              </div>

              <div className="relative">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={channelSearch}
                  onChange={e => setChannelSearch(e.target.value)}
                  placeholder="Filter channels, rooms or buddies..."
                  className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-950 border border-slate-800 rounded-lg text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-amber-500/60"
                />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-2.5 space-y-4 max-h-[560px]">
              {/* Section 1: General & ICAI Subject Channels */}
              <div>
                <div className="px-2 mb-1.5 text-[11px] font-bold text-slate-400">
                  Official ICAI Subject Channels
                </div>
                <div className="space-y-1">
                  <button
                    onClick={() => setSelectedChatTarget('group_lounge')}
                    className={`w-full flex items-center justify-between gap-2 px-2.5 py-2 rounded-xl text-left text-xs font-semibold transition-all cursor-pointer border ${
                      selectedChatTarget === 'group_lounge'
                        ? 'bg-amber-500/15 border-amber-500/45 text-amber-200 font-bold'
                        : 'border-transparent text-slate-300 hover:bg-slate-900/80 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <Hash
                        className={`w-4 h-4 shrink-0 ${
                          selectedChatTarget === 'group_lounge' ? 'text-amber-400' : 'text-slate-400'
                        }`}
                      />
                      <span className="truncate">General Study Lounge</span>
                    </div>
                    <span className="text-[10px] font-mono text-slate-400 shrink-0">All</span>
                  </button>

                  {SUBJECT_CIRCLES.filter(
                    c =>
                      !channelSearch.trim() ||
                      c.name.toLowerCase().includes(channelSearch.toLowerCase()) ||
                      c.subjectId.toLowerCase().includes(channelSearch.toLowerCase())
                  ).map(circle => {
                    const isSelected = selectedChatTarget === circle.id;
                    const pStyle = PAPER_BADGE_STYLES[circle.subjectId] || PAPER_BADGE_STYLES.General;
                    return (
                      <button
                        key={circle.id}
                        onClick={() => {
                          setSelectedChatTarget(circle.id);
                          setComposerSubject(circle.subjectId);
                        }}
                        className={`w-full flex items-center justify-between gap-2 px-2.5 py-2 rounded-xl text-left text-xs font-semibold transition-all cursor-pointer border ${
                          isSelected
                            ? 'bg-amber-500/15 border-amber-500/45 text-amber-200 font-bold'
                            : 'border-transparent text-slate-300 hover:bg-slate-900/80 hover:text-white'
                        }`}
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          <BookOpen
                            className={`w-3.5 h-3.5 shrink-0 ${
                              isSelected ? 'text-amber-400' : 'text-slate-400'
                            }`}
                          />
                          <span className="truncate">{circle.name}</span>
                        </div>
                        <span
                          className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded border shrink-0 ${pStyle.bg} ${pStyle.text} ${pStyle.border}`}
                        >
                          {circle.subjectId}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Section 2: Custom & Group Study Rooms */}
              <div>
                <div className="px-2 mb-1.5 flex items-center justify-between text-[11px] font-bold text-slate-400 tabular-nums">
                  <span>Group Study Rooms</span>
                  <span>{allStudyRooms.length}</span>
                </div>
                <div className="space-y-1">
                  {allStudyRooms
                    .filter(
                      r =>
                        (!r.isPrivate || unlockedRoomIds.includes(r.id) || r.creatorId === user.uid) &&
                        (!channelSearch.trim() ||
                          r.name.toLowerCase().includes(channelSearch.toLowerCase()) ||
                          r.subjectId.toLowerCase().includes(channelSearch.toLowerCase()))
                    )
                    .map(room => {
                      const isSelected = selectedChatTarget === room.id;
                      const pStyle = PAPER_BADGE_STYLES[room.subjectId] || PAPER_BADGE_STYLES.General;
                      return (
                        <button
                          key={room.id}
                          onClick={() => {
                            setSelectedChatTarget(room.id);
                            if (room.subjectId !== 'General') setComposerSubject(room.subjectId);
                          }}
                          className={`w-full flex items-center justify-between gap-2 px-2.5 py-2 rounded-xl text-left text-xs font-semibold transition-all cursor-pointer border ${
                            isSelected
                              ? 'bg-amber-500/15 border-amber-500/45 text-amber-200 font-bold'
                              : 'border-transparent text-slate-300 hover:bg-slate-900/80 hover:text-white'
                          }`}
                        >
                          <div className="flex items-center gap-2 min-w-0">
                            {room.isPrivate ? (
                              <Lock className="w-3.5 h-3.5 shrink-0 text-amber-400" />
                            ) : (
                              <Layers
                                className={`w-3.5 h-3.5 shrink-0 ${
                                  isSelected ? 'text-amber-400' : 'text-cyan-400'
                                }`}
                              />
                            )}
                            <span className="truncate">{room.name}</span>
                          </div>
                          <span
                            className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded border shrink-0 ${pStyle.bg} ${pStyle.text} ${pStyle.border}`}
                          >
                            {room.subjectId}
                          </span>
                        </button>
                      );
                    })}
                </div>
              </div>

              {/* Section 3: Direct 1-on-1 Connected Buddies */}
              <div>
                <div className="px-2 mb-1.5 flex items-center justify-between text-[11px] font-bold text-slate-400 tabular-nums">
                  <span>Direct 1-on-1 Buddies</span>
                  <span>{peers.length}</span>
                </div>
                {peers.length === 0 ? (
                  <div className="px-2.5 py-3 rounded-xl bg-slate-950/70 border border-slate-800/90 text-[11px] text-slate-400">
                    No direct buddies connected yet. Connect with peers in{' '}
                    <button
                      onClick={() => setActiveTab('buddies')}
                      className="text-amber-400 hover:text-amber-300 font-bold underline cursor-pointer"
                    >
                      Buddies & Privacy
                    </button>
                    .
                  </div>
                ) : (
                  <div className="space-y-1">
                    {peers
                      .filter(
                        p =>
                          !channelSearch.trim() ||
                          p.displayName.toLowerCase().includes(channelSearch.toLowerCase()) ||
                          p.studentHandle.toLowerCase().includes(channelSearch.toLowerCase())
                      )
                      .map(peer => {
                        const isSelected = selectedChatTarget === peer.uid;
                        return (
                          <button
                            key={peer.uid}
                            onClick={() => setSelectedChatTarget(peer.uid)}
                            className={`w-full flex items-center justify-between gap-2 px-2.5 py-2 rounded-xl text-left text-xs font-semibold transition-all cursor-pointer border ${
                              isSelected
                                ? 'bg-amber-500/15 border-amber-500/45 text-amber-200 font-bold'
                                : 'border-transparent text-slate-300 hover:bg-slate-900/80 hover:text-white'
                            }`}
                          >
                            <div className="flex items-center gap-2 min-w-0">
                              <UserCheck
                                className={`w-3.5 h-3.5 shrink-0 ${
                                  isSelected ? 'text-amber-400' : 'text-emerald-400'
                                }`}
                              />
                              <div className="truncate">
                                <div className="truncate font-bold">{peer.displayName}</div>
                                <div
                                  className={`text-[10px] font-mono truncate ${
                                    isSelected ? 'text-amber-300/90' : 'text-slate-400'
                                  }`}
                                >
                                  @{peer.studentHandle}
                                </div>
                              </div>
                            </div>
                            <Shield className="w-3.5 h-3.5 shrink-0 text-slate-400" />
                          </button>
                        );
                      })}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Main Secured Chat & Doubt Resolution Stream */}
          <div className="lg:col-span-8 xl:col-span-9 bg-slate-900/90 flex flex-col min-w-0">
            {/* Active Channel Header & Stream Filter Bar */}
            <div className="p-3.5 sm:p-4 border-b border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-900/95">
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="text-sm sm:text-base font-black text-white truncate">
                    {activeChannelMeta.title}
                  </h2>
                  <span className="text-[11px] font-mono text-amber-400 font-semibold">
                    · {activeChannelMeta.badge}
                  </span>
                  {activeChannelMeta.inviteCode && (
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(activeChannelMeta.inviteCode!);
                        setCopiedCodeId(activeChannelMeta.inviteCode!);
                        setTimeout(() => setCopiedCodeId(null), 2000);
                      }}
                      className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-mono font-bold bg-amber-500/15 text-amber-300 border border-amber-500/35 cursor-pointer"
                      title="Copy Private Room Invite Code"
                    >
                      <KeyRound className="w-3 h-3" />
                      {copiedCodeId === activeChannelMeta.inviteCode
                        ? 'Copied!'
                        : activeChannelMeta.inviteCode}
                    </button>
                  )}
                </div>
              </div>

              {/* Message Type Segmented Filter Buttons */}
              <div className="flex flex-wrap items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800 shrink-0">
                {(
                  [
                    { id: 'all', label: 'All' },
                    { id: 'doubt', label: 'Doubts' },
                    { id: 'request', label: 'Material Req' },
                    { id: 'unresolved', label: 'Unresolved' }
                  ] as const
                ).map(f => (
                  <button
                    key={f.id}
                    onClick={() => setChatFilter(f.id)}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-colors cursor-pointer whitespace-nowrap ${
                      chatFilter === f.id
                        ? 'bg-amber-500 text-slate-950 font-black'
                        : 'text-slate-400 hover:text-slate-100 hover:bg-slate-900'
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Messages Scroll Area */}
            <div
              ref={chatScrollRef}
              className="flex-1 overflow-y-auto p-4 space-y-3 min-h-[380px] max-h-[480px] bg-[#081829]"
            >
              {filteredChatMessages.length === 0 ? (
                <div className="h-72 flex flex-col items-center justify-center text-center px-4">
                  <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 mb-3">
                    <Shield className="w-6 h-6" />
                  </div>
                  <h4 className="text-sm font-bold text-slate-100 mb-1">
                    Secured Peer Channel Ready
                  </h4>
                </div>
              ) : (
                filteredChatMessages.map(msg => {
                  const isMine = msg.senderId === user.uid;
                  const msgType =
                    msg.msgType ||
                    (msg.text.startsWith('[DOUBT]')
                      ? 'doubt'
                      : msg.text.startsWith('[REQUEST]')
                      ? 'request'
                      : 'chat');

                  return (
                    <div
                      key={msg.id}
                      className={`flex flex-col ${isMine ? 'items-end' : 'items-start'}`}
                    >
                      <div
                        className={`max-w-full sm:max-w-[85%] rounded-2xl p-3.5 border transition-all ${
                          msgType === 'doubt'
                            ? msg.isResolved
                              ? 'bg-emerald-950/35 border-emerald-500/35 text-slate-100'
                              : 'bg-amber-500/10 border-amber-500/40 text-slate-100'
                            : msgType === 'request'
                            ? msg.isResolved
                              ? 'bg-emerald-950/35 border-emerald-500/35 text-slate-100'
                              : 'bg-cyan-500/10 border-cyan-500/40 text-slate-100'
                            : isMine
                            ? 'bg-amber-500/15 text-slate-100 border-amber-500/40'
                            : 'bg-slate-900/95 text-slate-100 border-slate-800'
                        }`}
                      >
                        {/* Sender & Timestamp Header */}
                        <div className="flex flex-wrap items-center justify-between gap-2 mb-1.5">
                          <div className="flex flex-wrap items-center gap-1.5 text-xs">
                            <span
                              className={`font-extrabold ${
                                isMine ? 'text-amber-300' : 'text-cyan-300'
                              }`}
                            >
                              {isMine ? 'You' : msg.senderName}
                            </span>

                            {/* Structured Doubt / Material Request Labels */}
                            {msgType === 'doubt' && (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-black uppercase bg-amber-500 text-slate-950">
                                <HelpCircle className="w-3 h-3" /> Doubt Request
                              </span>
                            )}
                            {msgType === 'request' && (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-black uppercase bg-cyan-400 text-slate-950">
                                <FileText className="w-3 h-3" /> Material Request
                              </span>
                            )}
                            {msg.subjectTag && (
                              <span className="text-[11px] font-mono font-bold text-amber-300">
                                · {msg.subjectTag}
                              </span>
                            )}
                            {msg.chapterTag && (
                              <span className="text-[11px] font-mono text-slate-300">
                                · {msg.chapterTag}
                              </span>
                            )}
                            {(msgType === 'doubt' || msgType === 'request') && (
                              <span
                                className={`text-[10.5px] font-mono font-bold ${
                                  msg.isResolved ? 'text-emerald-400' : 'text-rose-400'
                                }`}
                              >
                                ·{' '}
                                {msg.isResolved
                                  ? `Resolved${msg.resolvedBy ? ` by ${msg.resolvedBy}` : ''}`
                                  : 'Open'}
                              </span>
                            )}
                          </div>

                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-mono tabular-nums text-slate-400">
                              {new Date(msg.timestamp).toLocaleTimeString([], {
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </span>
                            {isMine && (
                              <button
                                onClick={() => handleDeleteMessage(msg.id)}
                                className="opacity-75 hover:opacity-100 text-rose-400 hover:text-rose-300 transition-opacity cursor-pointer"
                                title="Delete message"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>
                        </div>

                        {/* Message Body */}
                        <p className="text-xs sm:text-sm leading-relaxed whitespace-pre-wrap break-words text-slate-100">
                          {msg.text}
                        </p>

                        {/* Action Bar for Doubts & Material Requests */}
                        {(msgType === 'doubt' || msgType === 'request') && (
                          <div className="mt-2.5 pt-2 border-t border-slate-800 flex flex-wrap items-center justify-between gap-2">
                            <button
                              onClick={() => {
                                setMessageInput(
                                  `@${msg.senderName} Regarding [${msg.subjectTag || 'CA Final'}${
                                    msg.chapterTag ? ` - ${msg.chapterTag}` : ''
                                  }]: `
                                );
                              }}
                              className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-400 hover:text-amber-300 hover:underline cursor-pointer"
                            >
                              <Reply className="w-3 h-3" /> Reply to {msgType === 'doubt' ? 'Doubt' : 'Request'}
                            </button>

                            <button
                              onClick={() => handleToggleResolveMessage(msg)}
                              className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-bold transition-colors cursor-pointer ${
                                msg.isResolved
                                  ? 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                                  : 'bg-emerald-500 text-slate-950 font-black hover:bg-emerald-400'
                              }`}
                            >
                              <Check className="w-3 h-3" />
                              {msg.isResolved ? 'Reopen' : 'Mark Resolved'}
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Structured Composer (Standard Chat | Doubt Request | Material Request) */}
            <form
              onSubmit={handleSendMessage}
              className="p-3.5 border-t border-slate-800 bg-slate-900/95 space-y-2.5"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex flex-wrap items-center gap-1.5">
                  <span className="text-[11px] font-bold text-slate-400 mr-1">Mode:</span>
                  <button
                    type="button"
                    onClick={() => setComposerMode('chat')}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-colors cursor-pointer whitespace-nowrap ${
                      composerMode === 'chat'
                        ? 'bg-amber-500 text-slate-950 font-black'
                        : 'bg-slate-950 text-slate-300 border border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    Standard Chat
                  </button>
                  <button
                    type="button"
                    onClick={() => setComposerMode('doubt')}
                    className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-bold transition-colors cursor-pointer whitespace-nowrap ${
                      composerMode === 'doubt'
                        ? 'bg-amber-500 text-slate-950 font-black'
                        : 'bg-amber-500/10 text-amber-300 border border-amber-500/30 hover:bg-amber-500/20'
                    }`}
                  >
                    <HelpCircle className="w-3 h-3" /> Post Doubt Request
                  </button>
                  <button
                    type="button"
                    onClick={() => setComposerMode('request')}
                    className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-bold transition-colors cursor-pointer whitespace-nowrap ${
                      composerMode === 'request'
                        ? 'bg-cyan-400 text-slate-950 font-black'
                        : 'bg-cyan-500/10 text-cyan-300 border border-cyan-500/30 hover:bg-cyan-500/20'
                    }`}
                  >
                    <FileText className="w-3 h-3" /> Request Notes / Material
                  </button>
                </div>

                {/* Subject & Statutory Reference Tag Inputs when posting a Doubt or Material Request */}
                {composerMode !== 'chat' && (
                  <div className="flex flex-wrap items-center gap-2">
                    <select
                      value={composerSubject}
                      onChange={e => setComposerSubject(e.target.value)}
                      className="px-2.5 py-1 rounded-lg text-xs font-bold bg-slate-950 border border-slate-800 text-slate-100 focus:outline-none focus:border-amber-500"
                    >
                      <option value="FR">FR (Paper 1)</option>
                      <option value="AFM">AFM (Paper 2)</option>
                      <option value="Audit">Audit (Paper 3)</option>
                      <option value="DT">DT (Paper 4)</option>
                      <option value="IDT">IDT (Paper 5)</option>
                      <option value="IBS">IBS (Paper 6)</option>
                    </select>
                    <input
                      type="text"
                      value={composerChapter}
                      onChange={e => setComposerChapter(e.target.value)}
                      placeholder="Standard / Sec ref (e.g., Ind AS 115, SA 500, Sec 14A)"
                      className="px-2.5 py-1 rounded-lg text-xs bg-slate-950 border border-slate-800 text-slate-100 placeholder:text-slate-500 w-56 max-w-full focus:outline-none focus:border-amber-500"
                    />
                  </div>
                )}
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={messageInput}
                  onChange={e => setMessageInput(e.target.value)}
                  placeholder={
                    composerMode === 'doubt'
                      ? `Describe your ${composerSubject} statutory or numerical doubt clearly...`
                      : composerMode === 'request'
                      ? `Specify the ${composerSubject} RTP/MTP/summary note or reference you need...`
                      : `Write a secured message in ${activeChannelMeta.title}...`
                  }
                  className="flex-1 min-w-0 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm bg-slate-950 border border-slate-800 text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-amber-500/60"
                />
                <button
                  type="submit"
                  disabled={!messageInput.trim()}
                  className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-black bg-amber-500 hover:bg-amber-400 disabled:opacity-40 text-slate-950 transition-all shrink-0 cursor-pointer whitespace-nowrap"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Send</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =====================================================================
          TAB 2: GROUP STUDY ROOMS & SUBJECT CIRCLES
         ===================================================================== */}
      {activeTab === 'rooms' && (
        <div className="space-y-5 min-w-0">
          {/* Action Bar + Paper Filter Strip */}
          <div className="bg-slate-900/90 rounded-2xl p-4 sm:p-5 border border-slate-800 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="min-w-0">
                <h2 className="text-base sm:text-lg font-black text-white">
                  CA Final Group Study Rooms & Subject Circles
                </h2>
              </div>
              <div className="flex flex-wrap items-center gap-2 shrink-0">
                <button
                  onClick={() => setShowJoinByCodeModal(true)}
                  className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold bg-slate-950 hover:bg-slate-800 text-slate-200 border border-slate-800 transition-colors cursor-pointer whitespace-nowrap"
                >
                  <KeyRound className="w-4 h-4 text-amber-400" />
                  <span>Join via Invite Code</span>
                </button>
                <button
                  onClick={() => setShowCreateRoomModal(true)}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-xs transition-colors cursor-pointer whitespace-nowrap"
                >
                  <Plus className="w-4 h-4" />
                  <span>Create Group Room</span>
                </button>
              </div>
            </div>

            {/* Paper Segmented Filter Strip */}
            <div className="flex flex-wrap items-center gap-1.5 bg-slate-950 p-1.5 rounded-xl border border-slate-800">
              {['ALL', 'FR', 'AFM', 'Audit', 'DT', 'IDT', 'IBS', 'General'].map(sub => (
                <button
                  key={sub}
                  onClick={() => setRoomSubjectFilter(sub)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer whitespace-nowrap ${
                    roomSubjectFilter === sub
                      ? 'bg-amber-500 text-slate-950 font-black'
                      : 'text-slate-400 hover:text-slate-100 hover:bg-slate-900'
                  }`}
                >
                  {sub === 'ALL' ? 'All Papers' : sub}
                </button>
              ))}
            </div>
          </div>

          {/* Student-Created & Curated Group Study Rooms */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-slate-200 tabular-nums">
                Active Group Chat Rooms ({allStudyRooms.length})
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {allStudyRooms
                .filter(r => roomSubjectFilter === 'ALL' || r.subjectId === roomSubjectFilter)
                .map(room => {
                  const isUnlocked =
                    !room.isPrivate ||
                    unlockedRoomIds.includes(room.id) ||
                    room.creatorId === user.uid;
                  const pStyle = PAPER_BADGE_STYLES[room.subjectId] || PAPER_BADGE_STYLES.General;

                  return (
                    <div
                      key={room.id}
                      className="bg-slate-900/90 rounded-2xl p-4 border border-slate-800 flex flex-col justify-between gap-4 hover:border-amber-500/40 transition-all"
                    >
                      <div className="space-y-2">
                        <div className="flex items-center justify-between gap-2">
                          <span
                            className={`px-2.5 py-0.5 rounded-md text-[10px] font-mono font-bold uppercase border ${pStyle.bg} ${pStyle.text} ${pStyle.border}`}
                          >
                            {room.subjectId}
                          </span>
                          <div className="flex items-center gap-1.5 text-[11px] font-mono">
                            {room.isPrivate ? (
                              <span className="inline-flex items-center gap-1 text-amber-400 font-bold">
                                <Lock className="w-3 h-3" /> Invite-Only
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 text-emerald-400 font-bold">
                                <Unlock className="w-3 h-3" /> Public Room
                              </span>
                            )}
                            {room.creatorId === user.uid && (
                              <button
                                onClick={() => handleDeleteRoom(room.id)}
                                className="p-1 text-slate-400 hover:text-rose-400 transition-colors cursor-pointer"
                                title="Delete Room"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>
                        </div>

                        <h4 className="text-sm font-black text-white">
                          {room.name}
                        </h4>
                        <p className="text-xs text-slate-400 line-clamp-2">
                          {room.topic}
                        </p>
                      </div>

                      <div className="pt-3 border-t border-slate-800 flex items-center justify-between gap-2">
                        <div className="text-[11px] text-slate-400 truncate">
                          Host: <span className="font-semibold text-slate-200">{room.creatorName}</span>
                        </div>

                        <div className="flex items-center gap-1.5 shrink-0">
                          {room.isPrivate && room.inviteCode && isUnlocked && (
                            <button
                              onClick={() => {
                                navigator.clipboard.writeText(room.inviteCode!);
                                setCopiedCodeId(room.id);
                                setTimeout(() => setCopiedCodeId(null), 2000);
                              }}
                              className="px-2 py-1.5 rounded-lg text-[10px] font-mono font-bold bg-amber-500/15 text-amber-300 border border-amber-500/35 cursor-pointer"
                              title="Copy Invite Code"
                            >
                              {copiedCodeId === room.id ? 'Copied!' : room.inviteCode}
                            </button>
                          )}

                          {isUnlocked ? (
                            <button
                              onClick={() => {
                                setSelectedChatTarget(room.id);
                                setActiveTab('chat');
                              }}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-black bg-amber-500 hover:bg-amber-400 text-slate-950 transition-colors cursor-pointer whitespace-nowrap"
                            >
                              <MessageSquare className="w-3.5 h-3.5" />
                              <span>Open Chat</span>
                            </button>
                          ) : (
                            <button
                              onClick={() => setShowJoinByCodeModal(true)}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-amber-500/15 hover:bg-amber-500/25 text-amber-300 border border-amber-500/35 transition-colors cursor-pointer whitespace-nowrap"
                            >
                              <KeyRound className="w-3.5 h-3.5" />
                              <span>Unlock Room</span>
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>

          {/* Official ICAI 6 Paper Subject Study Circles */}
          <div>
            <h3 className="text-sm font-bold text-slate-200 mb-3">
              Official ICAI Subject Doubt Circles (Paper 1 to Paper 6)
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {SUBJECT_CIRCLES.filter(
                c => roomSubjectFilter === 'ALL' || c.subjectId === roomSubjectFilter
              ).map(circle => (
                <div
                  key={circle.id}
                  className="bg-slate-900/90 rounded-2xl p-4 border border-slate-800 hover:border-slate-700 flex flex-col justify-between gap-4 transition-all"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between gap-2">
                      <span
                        className={`px-2.5 py-0.5 rounded-md text-[10px] font-mono font-bold uppercase border ${circle.accentBg} ${circle.accentText} ${circle.accentBorder}`}
                      >
                        {circle.paperNo} · {circle.subjectId}
                      </span>
                      <span className="text-[10.5px] font-mono text-slate-400">24/7 Doubt Desk</span>
                    </div>
                    <h4 className="text-sm font-black text-white">
                      {circle.name}
                    </h4>
                    <div className="text-[11px] font-mono text-slate-300 pt-1">
                      {circle.activeTopics.join(' · ')}
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      setSelectedChatTarget(circle.id);
                      setComposerSubject(circle.subjectId);
                      setActiveTab('chat');
                    }}
                    className="w-full inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-slate-950 hover:bg-amber-500 text-slate-200 hover:text-slate-950 border border-slate-800 hover:border-amber-400 transition-colors cursor-pointer"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>Enter {circle.subjectId} Channel</span>
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* =====================================================================
          TAB 3: GLOBAL COHORT DASHBOARD & OPEN DOUBTS FEED
         ===================================================================== */}
      {activeTab === 'global' && (
        <div className="space-y-5 min-w-0">
          {/* Global vs My Buddies Comparison Header */}
          <div className="bg-slate-900/90 rounded-2xl p-4 sm:p-5 border border-slate-800 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div className="min-w-0">
              <h2 className="text-base sm:text-lg font-black text-white">
                {dashboardScope === 'global'
                  ? 'Global CA Final Cohort Leaderboard'
                  : 'My Study Buddies Benchmark Table'}
              </h2>
            </div>

            <div className="flex flex-wrap items-center gap-2.5">
              {/* Cohort Toggle: Global Leaderboard vs My Buddies */}
              <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800">
                <button
                  onClick={() => setDashboardScope('global')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                    dashboardScope === 'global'
                      ? 'bg-amber-500 text-slate-950 font-black'
                      : 'text-slate-400 hover:text-slate-100'
                  }`}
                >
                  <Globe className="w-3.5 h-3.5" />
                  <span>Global Cohort</span>
                </button>
                <button
                  onClick={() => setDashboardScope('buddies')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap tabular-nums ${
                    dashboardScope === 'buddies'
                      ? 'bg-amber-500 text-slate-950 font-black'
                      : 'text-slate-400 hover:text-slate-100'
                  }`}
                >
                  <Users className="w-3.5 h-3.5" />
                  <span>My Buddies ({peers.length + 1})</span>
                </button>
              </div>

              {/* Sort Metric Selector */}
              <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800">
                {(
                  [
                    { id: 'today', label: 'Today Hrs' },
                    { id: 'total', label: 'Total Hrs' },
                    { id: 'accuracy', label: 'Accuracy' },
                    { id: 'streak', label: 'Streak' }
                  ] as const
                ).map(s => (
                  <button
                    key={s.id}
                    onClick={() => setLeaderboardSortBy(s.id)}
                    className={`px-2.5 py-1.5 rounded-lg text-[11px] font-bold transition-colors cursor-pointer whitespace-nowrap ${
                      leaderboardSortBy === s.id
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 font-black'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-12 gap-5 items-start">
            {/* Left 8 Cols: Privacy-Respecting Leaderboard Table */}
            <div className="xl:col-span-8 bg-slate-900/90 rounded-2xl border border-slate-800 overflow-hidden min-w-0">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse tabular-nums">
                  <thead>
                    <tr className="border-b border-slate-800 bg-slate-950/85 text-[10.5px] font-mono font-bold text-slate-400">
                      <th className="py-3 px-3.5">Rank</th>
                      <th className="py-3 px-3.5">Student & Status</th>
                      <th className="py-3 px-3.5 text-right">Today</th>
                      <th className="py-3 px-3.5 text-right">Total Focus</th>
                      <th className="py-3 px-3.5 text-right">MCQ Acc.</th>
                      <th className="py-3 px-3.5 text-right">Streak</th>
                      <th className="py-3 px-3.5 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/80 text-xs">
                    {leaderboardEntries.map((entry, idx) => (
                      <tr
                        key={entry.uid}
                        className={`${
                          entry.isSelf
                            ? 'bg-amber-500/10'
                            : 'hover:bg-slate-950/50'
                        } transition-colors`}
                      >
                        <td className="py-3 px-3.5 font-mono font-black text-amber-400">
                          #{idx + 1}
                        </td>
                        <td className="py-3 px-3.5 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-white truncate">
                              {entry.displayName}
                            </span>
                            {entry.isSelf && (
                              <span className="px-1.5 py-0.5 rounded text-[10px] font-mono font-black bg-amber-500 text-slate-950">
                                YOU
                              </span>
                            )}
                            {entry.isBuddy && !entry.isSelf && (
                              <span className="text-[10.5px] font-mono font-bold text-emerald-400">
                                · Buddy
                              </span>
                            )}
                          </div>
                          <div className="flex flex-wrap items-center gap-1.5 text-[11px] text-slate-400 mt-0.5">
                            <span className="font-mono text-amber-300/90">@{entry.studentHandle}</span>
                            <span>·</span>
                            <span className="text-slate-300 font-medium">
                              {entry.studyStatus || 'Revising CA Final'}
                            </span>
                          </div>
                        </td>
                        <td className="py-3 px-3.5 font-mono font-bold text-right">
                          {entry.canViewHours ? (
                            <span className="text-white">
                              {formatHours(Math.max(0, entry.todayMins))}
                            </span>
                          ) : (
                            <span className="inline-flex items-center justify-end gap-1 text-[11px] text-slate-500">
                              <EyeOff className="w-3 h-3" /> Hidden
                            </span>
                          )}
                        </td>
                        <td className="py-3 px-3.5 font-mono font-semibold text-right">
                          {entry.canViewHours ? (
                            <span className="text-slate-300">
                              {formatHours(Math.max(0, entry.totalMins))}
                            </span>
                          ) : (
                            <span className="inline-flex items-center justify-end gap-1 text-[11px] text-slate-500">
                              <EyeOff className="w-3 h-3" /> Hidden
                            </span>
                          )}
                        </td>
                        <td className="py-3 px-3.5 font-mono font-bold text-right">
                          {entry.canViewAccuracy ? (
                            <span className="text-emerald-400">
                              {Math.max(0, entry.accuracy)}%
                            </span>
                          ) : (
                            <span className="inline-flex items-center justify-end gap-1 text-[11px] text-slate-500">
                              <EyeOff className="w-3 h-3" /> Hidden
                            </span>
                          )}
                        </td>
                        <td className="py-3 px-3.5 font-mono font-bold text-right">
                          {entry.canViewStreak ? (
                            <span className="inline-flex items-center justify-end gap-1 text-amber-400">
                              <Flame className="w-3.5 h-3.5" /> {Math.max(0, entry.streak)}d
                            </span>
                          ) : (
                            <span className="inline-flex items-center justify-end gap-1 text-[11px] text-slate-500">
                              <EyeOff className="w-3 h-3" /> Hidden
                            </span>
                          )}
                        </td>
                        <td className="py-3 px-3.5 text-right">
                          {entry.isSelf ? (
                            <button
                              onClick={() => setActiveTab('buddies')}
                              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-bold bg-slate-950 border border-slate-800 text-slate-300 hover:border-slate-700 hover:text-white cursor-pointer whitespace-nowrap"
                            >
                              <SlidersHorizontal className="w-3 h-3 text-amber-400" /> Privacy
                            </button>
                          ) : entry.isBuddy ? (
                            <button
                              onClick={() => {
                                setSelectedChatTarget(entry.uid);
                                setActiveTab('chat');
                              }}
                              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-black bg-amber-500 text-slate-950 hover:bg-amber-400 cursor-pointer whitespace-nowrap"
                            >
                              <MessageSquare className="w-3 h-3" /> Chat
                            </button>
                          ) : (
                            <button
                              onClick={() => handleSendPeerRequest(entry)}
                              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-bold bg-amber-500/15 text-amber-300 border border-amber-500/35 hover:bg-amber-500/25 cursor-pointer whitespace-nowrap"
                            >
                              <UserPlus className="w-3 h-3" /> Add Buddy
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Right 4 Cols: Open Community Doubts & Material Requests Board */}
            <div className="xl:col-span-4 bg-slate-900/90 rounded-2xl p-4 border border-slate-800 space-y-3 min-w-0">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-black text-white">
                    Live Doubts & Material Requests
                  </h3>
                </div>
                <HelpCircle className="w-4 h-4 text-amber-400 shrink-0" />
              </div>

              {communityDoubts.length === 0 ? (
                <div className="p-6 rounded-xl bg-slate-950/80 border border-slate-800 text-center space-y-2.5">
                  <p className="text-xs font-semibold text-slate-300">
                    No open doubts or material requests right now.
                  </p>
                  <button
                    onClick={() => {
                      setComposerMode('doubt');
                      setActiveTab('chat');
                    }}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-black bg-amber-500 hover:bg-amber-400 text-slate-950 cursor-pointer"
                  >
                    Post a Doubt in Chat
                  </button>
                </div>
              ) : (
                <div className="space-y-2.5 max-h-[420px] overflow-y-auto pr-1">
                  {communityDoubts.map(item => (
                    <div
                      key={item.id}
                      className="p-3 rounded-xl bg-slate-950/85 border border-slate-800 space-y-1.5 hover:border-slate-700 transition-colors"
                    >
                      <div className="flex items-center justify-between gap-2 text-[11px] font-mono">
                        <div className="flex items-center gap-1.5">
                          <span
                            className={`font-black uppercase ${
                              item.msgType === 'request'
                                ? 'text-cyan-400'
                                : 'text-amber-400'
                            }`}
                          >
                            {item.msgType === 'request' ? 'Material Req' : 'Doubt'}
                          </span>
                          {item.subjectTag && (
                            <span className="text-slate-300 font-bold">
                              · {item.subjectTag}
                            </span>
                          )}
                          {item.isResolved && (
                            <span className="text-emerald-400 font-bold">
                              · Resolved
                            </span>
                          )}
                        </div>
                        <span className="text-[10px] text-slate-400 truncate">
                          {item.channelName}
                        </span>
                      </div>

                      <p className="text-xs text-slate-200 line-clamp-2">
                        {item.text}
                      </p>

                      <div className="flex items-center justify-between pt-1">
                        <span className="text-[10px] text-slate-400">By {item.senderName}</span>
                        <button
                          onClick={() => {
                            setSelectedChatTarget(item.channelId);
                            setActiveTab('chat');
                          }}
                          className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-400 hover:text-amber-300 hover:underline cursor-pointer"
                        >
                          <span>Open Thread</span>
                          <ArrowUpRight className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* =====================================================================
          TAB 4: BUDDY DASHBOARD & MY STATS PRIVACY CONTROL CENTER
         ===================================================================== */}
      {activeTab === 'buddies' && (
        <div className="space-y-5 min-w-0">
          {/* Section A: My Stats Visibility & Granular Privacy Control Panel */}
          <div className="bg-slate-900/90 rounded-2xl p-5 border border-slate-800 space-y-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-slate-800 pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-amber-400" />
                  <h2 className="text-base font-black text-white">
                    My Study Stats & Granular Privacy Controls
                  </h2>
                </div>
              </div>
              {savingPrivacy && (
                <span className="text-xs font-mono font-bold text-amber-400">
                  Syncing privacy preferences...
                </span>
              )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
              {/* Visibility Scope Mode Selector */}
              <div className="lg:col-span-5 space-y-2.5">
                <label className="block text-xs font-bold text-slate-300">
                  01. Profile Visibility Scope
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  {(
                    [
                      {
                        id: 'public',
                        title: 'Public Opt-In',
                        desc: 'Global + Buddies'
                      },
                      {
                        id: 'buddies',
                        title: 'Buddies Only',
                        desc: 'Connected Peers'
                      },
                      {
                        id: 'private',
                        title: 'Private Mode',
                        desc: 'Hidden from All'
                      }
                    ] as const
                  ).map(opt => (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() =>
                        handleSavePrivacySettings(
                          opt.id,
                          shareHours,
                          shareAccuracy,
                          shareStreak,
                          studyStatus
                        )
                      }
                      className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                        privacyScope === opt.id
                          ? 'bg-amber-500/15 border-amber-500/50 text-amber-300'
                          : 'bg-slate-950/85 border-slate-800 text-slate-300 hover:border-slate-700'
                      }`}
                    >
                      <div className="text-xs font-black">{opt.title}</div>
                    </button>
                  ))}
                </div>

                {/* Current Study Status Activity Tag */}
                <div className="pt-2">
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">
                    Current Study Status
                  </label>
                  <select
                    value={studyStatus}
                    onChange={e =>
                      handleSavePrivacySettings(
                        privacyScope,
                        shareHours,
                        shareAccuracy,
                        shareStreak,
                        e.target.value
                      )
                    }
                    className="w-full px-3 py-2 rounded-xl text-xs font-bold bg-slate-950 border border-slate-800 text-slate-100 focus:outline-none focus:border-amber-500"
                  >
                    {STUDY_STATUS_OPTIONS.map(st => (
                      <option key={st} value={st}>
                        {st}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Granular Metric Toggles (Hours, Accuracy, Streak) */}
              <div className="lg:col-span-7 space-y-2.5">
                <label className="block text-xs font-bold text-slate-300">
                  02. Granular Metric Sharing Toggles (Live Preview)
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 tabular-nums">
                  {/* Toggle 1: Study Hours */}
                  <div className="p-3.5 rounded-xl bg-slate-950/85 border border-slate-800 flex flex-col justify-between gap-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-300">
                        Study Hours
                      </span>
                      <Clock className="w-4 h-4 text-amber-400" />
                    </div>
                    <div>
                      <div className="text-base font-mono font-black text-white">
                        {formatHours(myStats.todayFocusMinutes)}{' '}
                        <span className="text-[11px] font-normal text-slate-400">
                          / {formatHours(myStats.totalFocusMinutes)}
                        </span>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() =>
                        handleSavePrivacySettings(
                          privacyScope,
                          !shareHours,
                          shareAccuracy,
                          shareStreak,
                          studyStatus
                        )
                      }
                      className={`w-full py-1.5 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
                        shareHours
                          ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/35'
                          : 'bg-slate-900 text-slate-400 border border-slate-800'
                      }`}
                    >
                      {shareHours ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                      <span>{shareHours ? 'Sharing On' : 'Hidden'}</span>
                    </button>
                  </div>

                  {/* Toggle 2: MCQ Accuracy */}
                  <div className="p-3.5 rounded-xl bg-slate-950/85 border border-slate-800 flex flex-col justify-between gap-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-300">
                        MCQ Accuracy
                      </span>
                      <Award className="w-4 h-4 text-emerald-400" />
                    </div>
                    <div>
                      <div className="text-base font-mono font-black text-white">
                        {myStats.accuracy}%{' '}
                        <span className="text-[11px] font-normal text-slate-400">
                          ({myStats.questionsAttempted} Qs)
                        </span>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() =>
                        handleSavePrivacySettings(
                          privacyScope,
                          shareHours,
                          !shareAccuracy,
                          shareStreak,
                          studyStatus
                        )
                      }
                      className={`w-full py-1.5 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
                        shareAccuracy
                          ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/35'
                          : 'bg-slate-900 text-slate-400 border border-slate-800'
                      }`}
                    >
                      {shareAccuracy ? (
                        <Eye className="w-3.5 h-3.5" />
                      ) : (
                        <EyeOff className="w-3.5 h-3.5" />
                      )}
                      <span>{shareAccuracy ? 'Sharing On' : 'Hidden'}</span>
                    </button>
                  </div>

                  {/* Toggle 3: Consistency Streak */}
                  <div className="p-3.5 rounded-xl bg-slate-950/85 border border-slate-800 flex flex-col justify-between gap-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-300">
                        Study Streak
                      </span>
                      <Flame className="w-4 h-4 text-amber-400" />
                    </div>
                    <div>
                      <div className="text-base font-mono font-black text-white">
                        {myStats.streakDays} Days
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() =>
                        handleSavePrivacySettings(
                          privacyScope,
                          shareHours,
                          shareAccuracy,
                          !shareStreak,
                          studyStatus
                        )
                      }
                      className={`w-full py-1.5 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
                        shareStreak
                          ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/35'
                          : 'bg-slate-900 text-slate-400 border border-slate-800'
                      }`}
                    >
                      {shareStreak ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                      <span>{shareStreak ? 'Sharing On' : 'Hidden'}</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Section B: Connect New Study Buddy & Pending Requests */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
            <div className="lg:col-span-5 bg-slate-900/90 rounded-2xl p-5 border border-slate-800 space-y-4">
              <div className="flex items-center gap-2">
                <UserPlus className="w-4 h-4 text-amber-400" />
                <h3 className="text-sm font-black text-white">
                  Connect with a Study Buddy by @Handle
                </h3>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={searchHandle}
                  onChange={e => setSearchHandle(e.target.value)}
                  placeholder="Enter peer @handle (e.g. @rahul_9a2f)"
                  className="flex-1 min-w-0 px-3.5 py-2 rounded-xl text-xs bg-slate-950 border border-slate-800 text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-amber-500"
                />
                <button
                  onClick={() => handleSendPeerRequest()}
                  disabled={isSearching || !searchHandle.trim()}
                  className="px-4 py-2 rounded-xl text-xs font-black bg-amber-500 hover:bg-amber-400 disabled:opacity-40 text-slate-950 shrink-0 cursor-pointer whitespace-nowrap"
                >
                  {isSearching ? 'Searching...' : 'Send Invite'}
                </button>
              </div>
              {searchError && (
                <div className="flex items-center gap-1.5 text-xs text-rose-400">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  <span>{searchError}</span>
                </div>
              )}
              {searchSuccess && (
                <div className="flex items-center gap-1.5 text-xs text-emerald-400">
                  <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                  <span>{searchSuccess}</span>
                </div>
              )}

              {/* Incoming & Sent Requests */}
              {(receivedRequests.length > 0 || sentRequests.length > 0) && (
                <div className="pt-3 border-t border-slate-800 space-y-2.5">
                  {receivedRequests.map(req => (
                    <div
                      key={req.id}
                      className="flex items-center justify-between gap-2 p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/30"
                    >
                      <div className="min-w-0">
                        <div className="text-xs font-bold text-white truncate">
                          {req.fromUserName}
                        </div>
                        <div className="text-[10px] font-mono text-amber-300 truncate">
                          @{req.fromUserHandle} wants to connect
                        </div>
                      </div>
                      <div className="flex items-center gap-1.5 shrink-0">
                        <button
                          onClick={() => handleAcceptRequest(req)}
                          className="p-1.5 rounded-lg bg-emerald-500 text-slate-950 hover:bg-emerald-400 cursor-pointer"
                          title="Accept Buddy"
                        >
                          <Check className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeclineOrCancelRequest(req.id)}
                          className="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700 cursor-pointer"
                          title="Decline"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}

                  {sentRequests.map(req => (
                    <div
                      key={req.id}
                      className="flex items-center justify-between gap-2 p-2.5 rounded-xl bg-slate-950 border border-slate-800"
                    >
                      <div className="min-w-0">
                        <div className="text-xs font-semibold text-slate-300 truncate">
                          Invite sent to @{req.toUserHandle}
                        </div>
                      </div>
                      <button
                        onClick={() => handleDeclineOrCancelRequest(req.id)}
                        className="text-[11px] font-bold text-rose-400 hover:underline shrink-0 cursor-pointer"
                      >
                        Cancel
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Right 7 Cols: Connected Buddy Dashboard Comparison Cards */}
            <div className="lg:col-span-7 bg-slate-900/90 rounded-2xl p-5 border border-slate-800 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <UserCheck className="w-4 h-4 text-emerald-400" />
                  <h3 className="text-sm font-black text-white tabular-nums">
                    Connected Study Buddies ({peers.length})
                  </h3>
                </div>
                <button
                  onClick={() => {
                    setDashboardScope('buddies');
                    setActiveTab('global');
                  }}
                  className="text-xs font-bold text-amber-400 hover:text-amber-300 hover:underline cursor-pointer"
                >
                  Compare in Leaderboard Table →
                </button>
              </div>

              {peers.length === 0 ? (
                <div className="p-8 rounded-xl bg-slate-950/80 border border-slate-800 text-center space-y-2">
                  <Users className="w-8 h-8 text-slate-500 mx-auto" />
                  <div className="text-xs font-bold text-slate-200">
                    No Connected Study Buddies Yet
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 tabular-nums">
                  {peers.map(peer => {
                    const globalPeer = globalCohortUsers.find(g => g.uid === peer.uid);
                    const pStats = peerStats[peer.uid];
                    const canHours = globalPeer ? globalPeer.shareHours !== false : true;
                    const canAcc = globalPeer ? globalPeer.shareAccuracy !== false : true;
                    const canStreak = globalPeer ? globalPeer.shareStreak !== false : true;

                    const todayMins = pStats?.todayFocusMinutes ?? globalPeer?.todayFocusMinutes ?? 0;
                    const totalMins = pStats?.totalFocusMinutes ?? globalPeer?.totalFocusMinutes ?? 0;
                    const acc = pStats?.accuracy ?? globalPeer?.practiceAccuracy ?? 0;
                    const streak = pStats?.streakDays ?? globalPeer?.studyStreakDays ?? 0;

                    return (
                      <div
                        key={peer.uid}
                        className="p-4 rounded-xl bg-slate-950/85 border border-slate-800 flex flex-col justify-between gap-3"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="min-w-0">
                            <div className="text-sm font-black text-white truncate">
                              {peer.displayName}
                            </div>
                            <div className="text-[11px] font-mono text-amber-400 truncate">
                              @{peer.studentHandle}
                            </div>
                            <div className="text-[11px] text-slate-400 mt-0.5 truncate">
                              {globalPeer?.studyStatus || peer.coursePreference || 'Both Groups'}
                            </div>
                          </div>
                          <button
                            onClick={() => handleRemovePeer(peer.uid)}
                            className="p-1 text-slate-400 hover:text-rose-400 cursor-pointer"
                            title="Disconnect Buddy"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-800 text-center">
                          <div className="p-2 rounded-lg bg-slate-900 border border-slate-800">
                            <div className="text-[10px] text-slate-400">Today / Total</div>
                            <div className="text-xs font-mono font-bold text-white mt-0.5">
                              {canHours ? `${formatHours(todayMins)} / ${formatHours(totalMins)}` : 'Hidden'}
                            </div>
                          </div>
                          <div className="p-2 rounded-lg bg-slate-900 border border-slate-800">
                            <div className="text-[10px] text-slate-400">Accuracy</div>
                            <div className="text-xs font-mono font-bold text-emerald-400 mt-0.5">
                              {canAcc ? `${acc}%` : 'Hidden'}
                            </div>
                          </div>
                          <div className="p-2 rounded-lg bg-slate-900 border border-slate-800">
                            <div className="text-[10px] text-slate-400">Streak</div>
                            <div className="text-xs font-mono font-bold text-amber-400 mt-0.5">
                              {canStreak ? `${streak}d` : 'Hidden'}
                            </div>
                          </div>
                        </div>

                        <button
                          onClick={() => {
                            setSelectedChatTarget(peer.uid);
                            setActiveTab('chat');
                          }}
                          className="w-full py-2 rounded-xl text-xs font-black bg-amber-500 hover:bg-amber-400 text-slate-950 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                        >
                          <MessageSquare className="w-3.5 h-3.5" />
                          <span>Secured 1-on-1 Chat</span>
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* =====================================================================
          MODAL 1: CREATE GROUP STUDY ROOM
         ===================================================================== */}
      {showCreateRoomModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="bg-[#0d1c2d] rounded-2xl border border-slate-700/80 max-w-md w-full p-5 space-y-4 shadow-2xl text-slate-100">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-black text-white">
                Create Group Study Room
              </h3>
              <button
                onClick={() => setShowCreateRoomModal(false)}
                className="p-1 text-slate-400 hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateStudyRoom} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  Room Name
                </label>
                <input
                  type="text"
                  required
                  value={newRoomName}
                  onChange={e => setNewRoomName(e.target.value)}
                  placeholder="e.g., May 2026 Group 1 Consolidation & CFS Sprint"
                  className="w-full px-3 py-2 rounded-xl text-xs bg-slate-950 border border-slate-800 text-white placeholder:text-slate-500 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  Target CA Final Paper
                </label>
                <select
                  value={newRoomSubject}
                  onChange={e => setNewRoomSubject(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl text-xs font-bold bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-amber-500"
                >
                  <option value="FR">Paper 1: Financial Reporting (FR)</option>
                  <option value="AFM">Paper 2: Advanced Financial Management (AFM)</option>
                  <option value="Audit">Paper 3: Advanced Auditing & Ethics (Audit)</option>
                  <option value="DT">Paper 4: Direct Tax & Intl Tax (DT)</option>
                  <option value="IDT">Paper 5: Indirect Tax Laws (IDT)</option>
                  <option value="IBS">Paper 6: Integrated Business Solutions (IBS)</option>
                  <option value="General">General / Both Groups Combined</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  Focus Topic / Goal
                </label>
                <input
                  type="text"
                  value={newRoomTopic}
                  onChange={e => setNewRoomTopic(e.target.value)}
                  placeholder="e.g., Daily RTP/MTP case scenarios & doubt clearing"
                  className="w-full px-3 py-2 rounded-xl text-xs bg-slate-950 border border-slate-800 text-white placeholder:text-slate-500 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between gap-3">
                <div>
                  <div className="text-xs font-bold text-slate-200">
                    Invite-Code Protected Private Room
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={newRoomPrivate}
                  onChange={e => setNewRoomPrivate(e.target.checked)}
                  className="w-4 h-4 accent-amber-500 rounded cursor-pointer"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCreateRoomModal(false)}
                  className="px-3.5 py-2 rounded-xl text-xs font-bold bg-slate-900 border border-slate-800 text-slate-300 hover:text-white cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl text-xs font-black bg-amber-500 hover:bg-amber-400 text-slate-950 cursor-pointer"
                >
                  Create & Open Room
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =====================================================================
          MODAL 2: JOIN PRIVATE ROOM BY INVITE CODE
         ===================================================================== */}
      {showJoinByCodeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="bg-[#0d1c2d] rounded-2xl border border-slate-700/80 max-w-sm w-full p-5 space-y-4 shadow-2xl text-slate-100">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-black text-white">
                Unlock Private Group Room
              </h3>
              <button
                onClick={() => {
                  setShowJoinByCodeModal(false);
                  setInviteCodeError('');
                }}
                className="p-1 text-slate-400 hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleJoinRoomByCode} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  Enter Room Invite Code
                </label>
                <input
                  type="text"
                  value={inviteCodeInput}
                  onChange={e => setInviteCodeInput(e.target.value)}
                  placeholder="e.g., RM-4829"
                  className="w-full px-3.5 py-2.5 rounded-xl text-sm font-mono uppercase bg-slate-950 border border-slate-800 text-white placeholder:text-slate-500 focus:outline-none focus:border-amber-500"
                />
              </div>

              {inviteCodeError && (
                <div className="text-xs text-rose-400 flex items-center gap-1.5">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  <span>{inviteCodeError}</span>
                </div>
              )}

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowJoinByCodeModal(false);
                    setInviteCodeError('');
                  }}
                  className="px-3.5 py-2 rounded-xl text-xs font-bold bg-slate-900 border border-slate-800 text-slate-300 hover:text-white cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl text-xs font-black bg-amber-500 hover:bg-amber-400 text-slate-950 cursor-pointer"
                >
                  Unlock & Join
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =====================================================================
          MODAL 3: CUSTOM USERNAME CLAIM & CASE-INSENSITIVE REGISTRY
         ===================================================================== */}
      {showUsernameModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="bg-[#0d1c2d] rounded-2xl border border-slate-700/80 max-w-lg w-full p-5 space-y-4 shadow-2xl text-slate-100">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-amber-400" />
                  <h3 className="text-base font-black text-white">
                    Claim Custom Username (@UserID)
                  </h3>
                </div>
              </div>
              <button
                onClick={() => setShowUsernameModal(false)}
                className="p-1 text-slate-400 hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleClaimCustomUsername} className="space-y-3.5">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-bold text-slate-300">
                    Choose Your Custom Username
                  </label>
                  <span className="text-[10px] font-mono text-slate-400">
                    3–24 chars (a-z, 0-9, _, .)
                  </span>
                </div>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 font-mono font-bold text-sm text-amber-400">
                    @
                  </span>
                  <input
                    type="text"
                    required
                    maxLength={24}
                    value={customHandleDraft}
                    onChange={e => setCustomHandleDraft(e.target.value.replace(/\s+/g, ''))}
                    placeholder="ca_harish.26"
                    className={`w-full pl-8 pr-3.5 py-2.5 rounded-xl text-sm font-mono font-bold bg-slate-950 border text-white focus:outline-none ${
                      handleAvailabilityState === 'taken' || handleAvailabilityState === 'invalid'
                        ? 'border-rose-500'
                        : handleAvailabilityState === 'available'
                        ? 'border-emerald-500'
                        : 'border-slate-800 focus:border-amber-500'
                    }`}
                  />
                </div>

                {/* Real-Time Case-Insensitive Uniqueness Feedback */}
                <div
                  className={`mt-1.5 text-xs font-mono flex items-center gap-1.5 ${
                    handleAvailabilityState === 'available'
                      ? 'text-emerald-400 font-bold'
                      : handleAvailabilityState === 'taken' || handleAvailabilityState === 'invalid'
                      ? 'text-rose-400 font-bold'
                      : handleAvailabilityState === 'checking'
                      ? 'text-amber-400'
                      : 'text-slate-400'
                  }`}
                >
                  {handleAvailabilityState === 'available' && <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />}
                  {(handleAvailabilityState === 'taken' || handleAvailabilityState === 'invalid') && (
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  )}
                  <span>
                    {handleAvailabilityMsg ||
                      'Case-insensitive match: e.g. "Harish_CA" and "harish_ca" map to the same unique ID.'}
                  </span>
                </div>
              </div>

              {claimHandleSuccess && (
                <div className="p-3 rounded-xl bg-emerald-500/15 border border-emerald-500/35 text-emerald-300 text-xs font-bold flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>{claimHandleSuccess}</span>
                </div>
              )}

              {/* Existing Registered Usernames Record Preview */}
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[11px] font-bold text-slate-300 tabular-nums">
                    Registered Usernames Record ({registeredUsernames.length})
                  </span>
                  <input
                    type="text"
                    value={registrySearchFilter}
                    onChange={e => setRegistrySearchFilter(e.target.value)}
                    placeholder="Filter taken handles..."
                    className="px-2 py-1 rounded-md text-[11px] font-mono bg-slate-900 border border-slate-800 text-slate-200 placeholder:text-slate-500 w-40 focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div className="flex flex-wrap gap-1.5 max-h-28 overflow-y-auto pr-1">
                  {registeredUsernames
                    .filter(
                      item =>
                        !registrySearchFilter.trim() ||
                        item.normalizedHandle.includes(normalizeUsername(registrySearchFilter))
                    )
                    .map(item => {
                      const isMine = item.uid === user.uid;
                      return (
                        <span
                          key={item.normalizedHandle}
                          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-mono border ${
                            isMine
                              ? 'bg-amber-500/15 text-amber-300 border-amber-500/40 font-bold'
                              : 'bg-slate-900 text-slate-400 border-slate-800'
                          }`}
                          title={isMine ? 'Your active registered handle' : `Registered by ${item.displayName || 'Student'}`}
                        >
                          @{item.displayHandle || item.normalizedHandle}
                          {isMine && <span className="text-[9px] uppercase">(You)</span>}
                        </span>
                      );
                    })}
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowUsernameModal(false)}
                  className="px-3.5 py-2 rounded-xl text-xs font-bold bg-slate-900 border border-slate-800 text-slate-300 hover:text-white cursor-pointer"
                >
                  Close
                </button>
                <button
                  type="submit"
                  disabled={
                    isClaimingHandle ||
                    handleAvailabilityState === 'taken' ||
                    handleAvailabilityState === 'invalid' ||
                    handleAvailabilityState === 'checking'
                  }
                  className="px-4 py-2 rounded-xl text-xs font-black bg-amber-500 hover:bg-amber-400 disabled:opacity-40 text-slate-950 cursor-pointer"
                >
                  {isClaimingHandle ? 'Claiming Handle...' : 'Claim & Lock Username'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudyPeersView;

