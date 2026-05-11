import { LogRotator } from './rotator';

export enum LogLevel {
  DEBUG = 0,
  INFO = 1,
  WARN = 2,
  ERROR = 3,
  FATAL = 4,
}

export const LogLevelNames: Record<LogLevel, string> = {
  [LogLevel.DEBUG]: 'DEBUG',
  [LogLevel.INFO]: 'INFO',
  [LogLevel.WARN]: 'WARN',
  [LogLevel.ERROR]: 'ERROR',
  [LogLevel.FATAL]: 'FATAL',
};

export interface LogEntry {
  timestamp: string;
  level: LogLevel;
  levelName: string;
  message: string;
  context?: Record<string, unknown>;
  module?: string;
}

export interface LoggerOptions {
  module?: string;
  minLevel?: LogLevel;
}

const APP_LOG_PREFIX = 'app';
const AUDIT_LOG_PREFIX = 'audit';

const appRotator = new LogRotator({ prefix: APP_LOG_PREFIX });
const auditRotator = new LogRotator({ prefix: AUDIT_LOG_PREFIX });

function formatLogEntry(
  level: LogLevel,
  message: string,
  context?: Record<string, unknown>,
  module?: string,
): LogEntry {
  return {
    timestamp: new Date().toISOString(),
    level,
    levelName: LogLevelNames[level],
    message,
    context,
    module,
  };
}

function serializeEntry(entry: LogEntry): string {
  return JSON.stringify(entry);
}

function parseLevel(level: string): LogLevel {
  const upper = level.toUpperCase();
  const found = Object.entries(LogLevelNames).find(([, v]) => v === upper);
  return found ? (found[0] as unknown as LogLevel) : LogLevel.INFO;
}

class BaseLogger {
  protected module?: string;
  protected minLevel: LogLevel;

  constructor(options?: LoggerOptions) {
    this.module = options?.module;
    this.minLevel = options?.minLevel ?? LogLevel.DEBUG;
  }

  setMinLevel(level: string | LogLevel): void {
    if (typeof level === 'string') {
      this.minLevel = parseLevel(level);
    } else {
      this.minLevel = level;
    }
  }

  protected shouldLog(level: LogLevel): boolean {
    return level >= this.minLevel;
  }

  async log(level: LogLevel, message: string, context?: Record<string, unknown>): Promise<void> {
    if (!this.shouldLog(level)) return;

    const entry = formatLogEntry(level, message, context, this.module);
    const serialized = serializeEntry(entry);

    await this.writeLog(serialized);
  }

  protected writeLog(_content: string): Promise<void> {
    return Promise.resolve();
  }

  async debug(message: string, context?: Record<string, unknown>): Promise<void> {
    await this.log(LogLevel.DEBUG, message, context);
  }

  async info(message: string, context?: Record<string, unknown>): Promise<void> {
    await this.log(LogLevel.INFO, message, context);
  }

  async warn(message: string, context?: Record<string, unknown>): Promise<void> {
    await this.log(LogLevel.WARN, message, context);
  }

  async error(message: string, context?: Record<string, unknown>): Promise<void> {
    await this.log(LogLevel.ERROR, message, context);
  }

  async fatal(message: string, context?: Record<string, unknown>): Promise<void> {
    await this.log(LogLevel.FATAL, message, context);
  }
}

class AppLogger extends BaseLogger {
  protected override async writeLog(content: string): Promise<void> {
    await appRotator.write(content);
  }
}

class AuditLogger extends BaseLogger {
  constructor(options?: LoggerOptions) {
    super({ ...options, minLevel: LogLevel.INFO });
  }

  protected override async writeLog(content: string): Promise<void> {
    await auditRotator.write(content);
  }
}

export const logger = new AppLogger({ module: 'app' });
export const auditLogger = new AuditLogger({ module: 'audit' });

export function createModuleLogger(module: string, minLevel?: LogLevel): AppLogger {
  return new AppLogger({ module, minLevel });
}

export function createAuditLogger(module: string): AuditLogger {
  return new AuditLogger({ module });
}

export { LogRotator };
