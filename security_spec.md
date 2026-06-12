# Security Specification - Agência Simulator Pro

## Data Invariants
1. A player's session metrics (`Save` document) belongs to the authenticated user owning the record. No cross-user reads or writes are permitted.
2. A client simulation document (`Client` subcollection) is fully tied to its parent user's save session. Users cannot view or modify other users' client lists.
3. Every write (create or update) to any document must provide valid, typed fields restricting malicious payloads.

## The Dirty Dozen Payloads (Deny Cases)
1. **Unauthenticated Read of User-Saves**: Read of `/user_saves/user123` by an anonymous client session.
2. **Cross-User Hijack Attempt**: Write of `/user_saves/userABC` by user `userXYZ` trying to alter level/XP.
3. **Ghost fields injection**: Write on a subcollection document with non-defined property schema.
4. **Invalid user ID in path**: Setting document ID in user_saves that does not correspond to `request.auth.uid`.
5. **No validation on update**: Bypassing custom property validations on write.
6. **Malicious negative level**: Setting integer field `level` of save to `-5` or `999999`.
7. **Malicious step transition**: Modifying client's `step` field to automated final states bypassing negociations.
8. **Owner ID mismatch**: Inserting user identifier elements with values other than `request.auth.uid`.
9. **Tampering with finished items**: Creating subsequent updates to finalized clients.
10. **Spoofing email status**: Reading or writing when `email_verified` is false (if required, or standard identification validation).
11. **Denial of Wallet payload size**: Creating strings exceeds acceptable sizes on client profiles.
12. **Recursive database scans**: Bypassing list query parameters.

## Tests Configuration
All rules enforce maximum size bounds and require active authenticated user tokens matching the exact URL paths.
