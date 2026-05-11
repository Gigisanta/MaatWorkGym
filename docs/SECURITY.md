# Security Documentation

## Authentication Flow

1. User submits credentials to /api/auth/login
2. Rate limiter checks client IP
3. Input validation sanitizes username/password
4. Password verified against bcrypt hash
5. On success: JWT created, cookie set, rate limit reset
6. On failure: Attempt counted, account locked if threshold reached

## Session Token

- Algorithm: HS256
- Expiration: 24 hours
- Contents: adminId, username, sessionId

## Security Headers

See PRODUCTION.md for full list.

## Security Best Practices Implemented

1. **Defense in Depth**: Multiple security layers
2. **Fail Secure**: Errors deny access by default
3. **Least Privilege**: Minimal permissions
4. **Secure Defaults**: Safe out-of-the-box configuration
