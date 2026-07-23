export enum LogLevel {
  DEBUG = 'DEBUG',
  INFO = 'INFO',
  WARN = 'WARN',
  ERROR = 'ERROR',
}

export class Logger {
  private prefix: string;

  constructor(prefix: string) {
    this.prefix = prefix;
  }

  private formatMessage(level: LogLevel, message: string): string {
    const timestamp = new Date().toISOString();
    return `[${timestamp}] [${level}] [${this.prefix}] ${message}`;
  }

  debug(message: string, ...meta: any[]): void {
    console.debug(this.formatMessage(LogLevel.DEBUG, message), ...meta);
  }

  info(message: string, ...meta: any[]): void {
    console.info(this.formatMessage(LogLevel.INFO, message), ...meta);
  }

  warn(message: string, ...meta: any[]): void {
    console.warn(this.formatMessage(LogLevel.WARN, message), ...meta);
  }

  error(message: string, error?: any, ...meta: any[]): void {
    console.error(this.formatMessage(LogLevel.ERROR, message), error || '', ...meta);
  }
}
