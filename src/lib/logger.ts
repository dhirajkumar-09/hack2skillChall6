/**
 * Safe development-only logger utility.
 * Prevents log leakage and code-smell warnings in production builds.
 */
export const logger = {
  warn: (...args: unknown[]): void => {
    if (process.env.NODE_ENV === "development") {
      // eslint-disable-next-line no-console
      console.warn(...args);
    }
  },
  error: (...args: unknown[]): void => {
    if (process.env.NODE_ENV === "development") {
      // eslint-disable-next-line no-console
      console.error(...args);
    }
  },
  info: (...args: unknown[]): void => {
    if (process.env.NODE_ENV === "development") {
      // eslint-disable-next-line no-console
      console.info(...args);
    }
  }
};
