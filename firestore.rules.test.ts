/**
 * Security Rule Verification Spec for NIVANTO Firestore Rules.
 * Run against Firebase Emulator Suite (@firebase/rules-unit-testing) when testing locally.
 */
export const dirtyDozenCases = [
  { name: 'Unauthenticated write to content/home', expected: 'PERMISSION_DENIED' },
  { name: 'Unauthenticated read of inactive service', expected: 'PERMISSION_DENIED' },
  { name: 'Unauthenticated list of services without active==true filter', expected: 'PERMISSION_DENIED' },
  { name: 'Unauthenticated read or list of inquiries', expected: 'PERMISSION_DENIED' },
  { name: 'Public inquiry creation with read: true', expected: 'PERMISSION_DENIED' },
  { name: 'Public inquiry creation with spoofed timestamp', expected: 'PERMISSION_DENIED' },
  { name: 'Public inquiry creation with extra ghost field', expected: 'PERMISSION_DENIED' },
  { name: 'Public inquiry creation exceeding message max length', expected: 'PERMISSION_DENIED' },
  { name: 'Public update or delete on inquiries', expected: 'PERMISSION_DENIED' },
  { name: 'Admin write to service with > 12 features', expected: 'PERMISSION_DENIED' },
  { name: 'Admin write with invalid document ID length > 128', expected: 'PERMISSION_DENIED' },
  { name: 'Unauthenticated write to templates', expected: 'PERMISSION_DENIED' },
] as const;
