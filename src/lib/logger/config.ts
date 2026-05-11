// GymPro Logger Configuration
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
export interface LoggerConfig {
  minLevel: LogLevel;
  maxFileSize: number;
  maxHistoryDays: number;
  enableConsole: boolean;
  enableFile: boolean;
  enableAudit: boolean;
}
function getDefaultConfig(): LoggerConfig {
  const env = process.env.NODE_ENV || 'development';
  const isProduction = env === 'production';
  return {
    minLevel: isProduction ? LogLevel.INFO : LogLevel.DEBUG,
    maxFileSize: isProduction ? 10 * 1024 * 1024 : 5 * 1024 * 1024,
    maxHistoryDays: isProduction ? 30 : 7,
    enableConsole: !isProduction,
    enableFile: true,
    enableAudit: true,
  };
}
export const loggerConfig: LoggerConfig = {
  ...getDefaultConfig(),
  minLevel: process.env.LOG_LEVEL
    ? parseLogLevel(process.env.LOG_LEVEL)
    : getDefaultConfig().minLevel,
  maxFileSize: process.env.LOG_MAX_SIZE
    ? parseInt(process.env.LOG_MAX_SIZE, 10)
    : getDefaultConfig().maxFileSize,
  maxHistoryDays: process.env.LOG_MAX_DAYS
    ? parseInt(process.env.LOG_MAX_DAYS, 10)
    : getDefaultConfig().maxHistoryDays,
};
function parseLogLevel(level: string): LogLevel {
  const upper = level.toUpperCase();
  const found = Object.entries(LogLevelNames).find(([, v]) => v === upper);
  return found ? (found[0] as unknown as LogLevel) : LogLevel.INFO;
}
export function getMinLevelName(): string {
  return LogLevelNames[loggerConfig.minLevel];
}
