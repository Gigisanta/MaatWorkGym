# GymPro - Production Preparation Guide

## Overview
This document describes the production-ready systems implemented for consistency, observability, and security.

---

## 1. Design System (src/lib/design-system/)

### Centralized Design Tokens
All design decisions are centralized in src/lib/design-system/:

- **colors** - Color palette with semantic naming
- **typography** - Font families, sizes, weights
- **spacing** - Consistent spacing scale
- **borderRadius** - Component border radius values
- **zIndex** - Layering scale for overlays/modals
- **layout** - Layout constants (sidebar, header, etc.)

### Accessibility (WCAG 2.1 AA)
- Focus ring styles with proper offset
- Touch target sizes (44x44px minimum)
- Screen reader support (srOnly utilities)
- Color contrast compliance

### Components (src/components/ui/)
All UI components are exported from src/lib/components-registry.ts:
- Button, Badge, Card, Avatar, Progress, Tooltip
- Input, Label, Modal

---

## 2. Logging System (src/lib/logger/)

### Log Levels
- DEBUG (0) - Detailed debugging info
- INFO (1) - General operational events
- WARN (2) - Warning conditions
- ERROR (3) - Error conditions
- FATAL (4) - Critical errors

### Configuration (Environment Variables)
| Variable | Default | Description |
|----------|---------|-------------|
| LOG_LEVEL | DEBUG (dev) / INFO (prod) | Minimum log level |
| LOG_MAX_SIZE | 10MB (prod) / 5MB (dev) | Max file size before rotation |
| LOG_MAX_DAYS | 30 (prod) / 7 (dev) | Log retention period |

### Log Files
- logs/app-YYYY-MM-DD.log - Application logs
- logs/audit-YYYY-MM-DD.log - Authentication audit logs

### Rotation
- **Size-based**: Rotates when file exceeds max size
- **Time-based**: New file created each day
- **Retention**: Automatic cleanup of files older than max days

---

## 3. Security System (src/lib/security/)

### Rate Limiting
- **Login attempts**: 5 per 15-minute window
- **Block duration**: 15 minutes after max attempts
- **Identifier**: Client IP address

### Input Validation
- Username: 3-50 chars, alphanumeric + _.- 
- Password: 8-128 chars
- DNI: 7-8 digits
- Email: Standard email format

### Sanitization
- Removes <> angle brackets
- Removes javascript: protocols
- Removes event handlers (on*=)
- Truncates to 255 characters

---

## 4. Authentication (src/lib/auth/)

### Password Security
- **Hash**: bcrypt with 12 salt rounds
- **Strength validation**: 8+ chars, uppercase, lowercase, number

### Session Management
- **Token**: JWT (HS256)
- **Duration**: 24 hours
- **Storage**: HTTP-only secure cookie
- **SameSite**: Strict

### Account Protection
- Lock after 5 failed attempts (15-minute lockout)
- Login attempt tracking
- Last login timestamp

---

## 5. Security Headers (src/middleware/security-headers.ts)

Applied to all responses:
- Content-Security-Policy
- Strict-Transport-Security (HSTS)
- X-Frame-Options: DENY
- X-Content-Type-Options: nosniff
- X-XSS-Protection
- Referrer-Policy
- Permissions-Policy

---

## 6. Error Handling (src/middleware/error-handler.ts)

### API Error Classes
- ValidationApiError (400)
- UnauthorizedApiError (401)
- ForbiddenApiError (403)
- NotFoundApiError (404)

All errors:
- Logged with request ID
- Return safe error messages (no internal details in production)
- Include request ID for troubleshooting

---

## Environment Variables for Production

`env
# Security
SESSION_SECRET=<random-256-bit-string>
NODE_ENV=production

# Logging (optional - defaults provided)
LOG_LEVEL=INFO
LOG_MAX_SIZE=10485760
LOG_MAX_DAYS=30
`

---

## Checklist Before Production

- [ ] Set SESSION_SECRET to a secure random value
- [ ] Set NODE_ENV=production
- [ ] Configure database backup strategy
- [ ] Set up log monitoring/aggregation
- [ ] Configure firewall rules
- [ ] Enable HTTPS
- [ ] Review rate limit settings
- [ ] Test error responses in production mode
