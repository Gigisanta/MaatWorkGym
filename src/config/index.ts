/**
 * Application-wide configuration consolidated
 * @module config
 */
export const config = {
  app: {
    name: 'MaatWorkGym',
    version: process.env.npm_package_version || '1.0.0',
    environment: process.env.NODE_ENV || 'development',
  },
  api: {
    prefix: '/api',
    rateLimit: {
      windowMs: 15 * 60 * 1000,
      max: 100,
    },
  },
  auth: {
    sessionDuration: 7 * 24 * 60 * 60,
    bcryptRounds: 12,
  },
  logging: {
    level: process.env.LOG_LEVEL || 'info',
    rotation: {
      maxSize: 10 * 1024 * 1024,
      maxFiles: 5,
    },
  },
} as const;

export type AppConfig = typeof config;
