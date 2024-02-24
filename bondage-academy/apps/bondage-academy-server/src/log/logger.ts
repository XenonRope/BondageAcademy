import { singleton } from "tsyringe";
import * as winston from "winston";

@singleton()
export class Logger {
  private winstonLogger;

  constructor() {
    this.winstonLogger = winston.createLogger({
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json(),
      ),
      transports: [new winston.transports.Console()],
    });
  }

  info(message: string) {
    this.winstonLogger.info(message);
  }

  warn(message: string) {
    this.winstonLogger.warn(message);
  }

  error(message: string) {
    this.winstonLogger.error(message);
  }
}
