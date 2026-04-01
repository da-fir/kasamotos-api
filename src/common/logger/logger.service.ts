import { Injectable } from '@nestjs/common';
import { createLogger, format, transports, Logger } from 'winston';

@Injectable()
export class LoggerService {
  private readonly logger: Logger;

  constructor() {
    this.logger = createLogger({
      level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
      format:
        process.env.NODE_ENV === 'production'
          ? format.combine(
              format.timestamp(),
              format.json(), // structured JSON in production
            )
          : format.combine(
              format.colorize(),
              format.timestamp({ format: 'HH:mm:ss' }),
              format.printf(({ timestamp, level, message, context }) => {
                return `[${timestamp}] ${level} [${context ?? 'App'}] ${message}`;
              }),
            ),
      transports: [new transports.Console()],
    });
  }

  log(message: string, context?: string) {
    this.logger.info(message, { context });
  }

  error(message: string, trace?: string, context?: string) {
    this.logger.error(message, { trace, context });
  }

  warn(message: string, context?: string) {
    this.logger.warn(message, { context });
  }

  debug(message: string, context?: string) {
    this.logger.debug(message, { context });
  }
}