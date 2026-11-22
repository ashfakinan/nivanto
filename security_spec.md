# Security Specification — NIVANTO Platform

## 1. Data Invariants
1. `content/{doc}` (`home`, `about`) is publicly readable, and only authenticated admins may write or update it with valid schema bounds.
2. `services/{serviceId}`, `portfolio/{portfolioId}`, and `templates/{templateId}` can only be read by unauthenticated visitors when `active == true`. Authenticated admins can read both active and inactive records and mutate them under strict schema and field-size constraints.
3. `inquiries/{inquiryId}` contains customer PII (`name`, `phone`, `business_name`, `message`). Public visitors may ONLY `create` inquiries with `read == false` and server-verified `timestamp == request.time`. Public visitors can NEVER `read`, `list`, `update`, or `delete` inquiries. Only authenticated admins may read, mark read/unread, or delete inquiries.
4. No arbitrary ghost fields (`hasOnly` enforced on all writes). All strings and arrays have strict `.size()` limits to prevent resource exhaustion.
5. Document IDs are strictly validated via `isValidId()` (`^[a-zA-Z0-9_\\-]+$`, max 128 chars).

## 2. Adversarial "Dirty Dozen" Payloads (Expected: PERMISSION_DENIED)
1. Unauthenticated write to `/content/home` -> DENIED
2. Unauthenticated read of `/services/svc-1` where `active == false` -> DENIED
3. Unauthenticated list of `/services` without `where('active', '==', true)` -> DENIED
4. Unauthenticated read/list of `/inquiries` -> DENIED
5. Public inquiry creation with `read: true` -> DENIED
6. Public inquiry creation with spoofed past `timestamp` (`!= request.time`) -> DENIED
7. Public inquiry creation with extra ghost field `isAdmin: true` -> DENIED
8. Public inquiry creation with > 2000 char `message` -> DENIED
9. Public update or delete on `/inquiries/{id}` -> DENIED
10. Admin write to `/services/{id}` with 20+ items in `features` array -> DENIED
11. Admin write to `/portfolio/{id}` with invalid ID containing `/` or >128 chars -> DENIED
12. Unauthenticated write to `/templates/{id}` -> DENIED
