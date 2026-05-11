# Logging Documentation

## Log Entry Format

`json
{
  "timestamp": "2024-01-15T10:30:00.000Z",
  "level": 1,
  "levelName": "INFO",
  "message": "User logged in",
  "context": {
    "username": "admin",
    "ipAddress": "192.168.1.1"
  },
  "module": "auth"
}
`

## Log Files

| File                 | Purpose                  | Min Level |
| -------------------- | ------------------------ | --------- |
| app-YYYY-MM-DD.log   | General application logs | DEBUG     |
| audit-YYYY-MM-DD.log | Authentication events    | INFO      |

## Using the Logger

` ypescript
import { logger, auditLogger } from "@/lib/logger";

// Application logging
logger.debug("Debug message", { detail: "value" });
logger.info("Info message");
logger.warn("Warning message");
logger.error("Error message", { error: err.message });

// Audit logging (always INFO+)
auditLogger.info("Auth event", { username: "admin" });
`

## Environment Configuration

See PRODUCTION.md for environment variables.
