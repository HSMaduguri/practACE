# pract.CA Security Specification

## Data Invariants

1. **Owner Exclusivity**: A user can only read, write, update, or delete their own practice attempts and bookmarked statutory sections.
2. **Type and Size Hardening**: No inputs can bypass size checks (e.g. section purposes <= 2000 characters; timestamps <= 64 characters) or format constraints.
3. **Immutability of Key Records**: Once high-level history is recorded, practice attempts are append/delete only; they are not dynamically editable by clients to prevent stat falsifications.

---

## The "Dirty Dozen" Malicious Payloads

The following payloads represent bypass vectors that must result in `PERMISSION_DENIED`:

### 1. Identity Spoofing (Save Practice Attempt as Another User)
**Target Path**: `/users/legit_user_123/practiceAttempts/attacker_attempt`
**Payload**:
```json
{
  "questionId": "AFM_Q1",
  "subjectId": "AFM",
  "chapterName": "Portfolio Management",
  "isCorrect": true,
  "timestamp": "2026-06-01T16:51:14Z"
}
```
*Expected Return*: `PERMISSION_DENIED` because the authenticated user is `attacker_456`, not `legit_user_123`.

### 2. Bypass Schema Verification (Add Ghost Field to Practice Attempt)
**Target Path**: `/users/legit_user_123/practiceAttempts/attempt_1`
**Payload**:
```json
{
  "questionId": "AFM_Q1",
  "subjectId": "AFM",
  "chapterName": "Portfolio Management",
  "isCorrect": true,
  "timestamp": "2026-06-01T16:51:14Z",
  "ghost_field_is_admin": true
}
```
*Expected Return*: `PERMISSION_DENIED` because `incoming().keys().size() == 5` is violated.

### 3. Subject Enum Poisoning on Attempt
**Target Path**: `/users/legit_user_123/practiceAttempts/attempt_1`
**Payload**:
```json
{
  "questionId": "AFM_Q1",
  "subjectId": "WRONG_SUBJECT_ID",
  "chapterName": "Portfolio Management",
  "isCorrect": true,
  "timestamp": "2026-06-01T16:51:14Z"
}
```
*Expected Return*: `PERMISSION_DENIED` because `subjectId` is not in ['AFM', 'FR', 'Audit', 'DT', 'IDT', 'IBS'].

### 4. Timestamp Parameter Exhaustion Attack (Denial of Wallet)
**Target Path**: `/users/legit_user_123/practiceAttempts/attempt_1`
**Payload**:
```json
{
  "questionId": "AFM_Q1",
  "subjectId": "AFM",
  "chapterName": "Portfolio Management",
  "isCorrect": true,
  "timestamp": "VERY_LONG_STRING_REPEATED_TEN_THOUSAND_TIMES_TO_CONSUME_FIRESTORE_CPU_AND_STORAGE_CAPACITY"
}
```
*Expected Return*: `PERMISSION_DENIED` because `timestamp.size() <= 64` check fails.

### 5. Chapter Name Overload Attack
**Target Path**: `/users/legit_user_123/practiceAttempts/attempt_1`
**Payload**:
```json
{
  "questionId": "AFM_Q1",
  "subjectId": "AFM",
  "chapterName": "A".repeat(400),
  "isCorrect": true,
  "timestamp": "2026-06-01T16:51:14Z"
}
```
*Expected Return*: `PERMISSION_DENIED` because `chapterName.size() <= 200` fails.

### 6. Incorrect Type Poisoning (isCorrect is a String)
**Target Path**: `/users/legit_user_123/practiceAttempts/attempt_1`
**Payload**:
```json
{
  "questionId": "AFM_Q1",
  "subjectId": "AFM",
  "chapterName": "Portfolio Management",
  "isCorrect": "yes_it_is",
  "timestamp": "2026-06-01T16:51:14Z"
}
```
*Expected Return*: `PERMISSION_DENIED` because `isCorrect` must be a boolean.

### 7. Spoofing Bookmark Creation for Non-Owner
**Target Path**: `/users/legit_user_123/bookmarkedSections/bookmark_1`
**Payload**:
```json
{
  "subjectId": "DT",
  "number": "Sec 115BAC",
  "heading": "Tax on income of certain individuals",
  "purpose": "Alternative tax regime details"
}
```
*Expected Return*: `PERMISSION_DENIED` because the request context token UID is not `legit_user_123`.

### 8. Ghost Field injection into Pinned Favorites
**Target Path**: `/users/legit_user_123/bookmarkedSections/bookmark_1`
**Payload**:
```json
{
  "subjectId": "DT",
  "number": "Sec 115BAC",
  "heading": "Tax on income of certain individuals",
  "purpose": "Alternative tax regime details",
  "bypass_chargeback": 0
}
```
*Expected Return*: `PERMISSION_DENIED` because the exact map key size for Bookmark is strictly `4`.

### 9. Excessively Large Heading Payload on Bookmark
**Target Path**: `/users/legit_user_123/bookmarkedSections/bookmark_1`
**Payload**:
```json
{
  "subjectId": "DT",
  "number": "Sec 115BAC",
  "heading": "B".repeat(500),
  "purpose": "Alternative tax regime details"
}
```
*Expected Return*: `PERMISSION_DENIED` because `heading.size() <= 256` is violated.

### 10. Malicious Long Statutory Purpose Payload
**Target Path**: `/users/legit_user_123/bookmarkedSections/bookmark_1`
**Payload**:
```json
{
  "subjectId": "DT",
  "number": "Sec 115BAC",
  "heading": "Tax on income",
  "purpose": "Z".repeat(5000)
}
```
*Expected Return*: `PERMISSION_DENIED` because `purpose.size() <= 2000` is violated.

### 11. Malformed Bookmark Subject ID Enum
**Target Path**: `/users/legit_user_123/bookmarkedSections/bookmark_1`
**Payload**:
```json
{
  "subjectId": "NOT_REAL_SYLLABUS",
  "number": "Sec 115BAC",
  "heading": "Tax on income",
  "purpose": "Purpose"
}
```
*Expected Return*: `PERMISSION_DENIED` because `subjectId` is not valid.

### 12. Prevent Attempt Modification (No client updates of scores allowed)
**Target Path**: `/users/legit_user_123/practiceAttempts/attempt_1`
**Action**: UPDATE
**Payload**: Update `isCorrect` to `true` (previously `false`)
*Expected Return*: `PERMISSION_DENIED` because updates to attempts are forbidden.
