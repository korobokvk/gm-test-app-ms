import { LoggerService } from '@nestjs/common';

export class AppLogger implements LoggerService {
  log(message: any, ...optionalParams: any[]) {
    this.log(message, optionalParams);
  }
  error(message: any, ...optionalParams: any[]) {
    this.error(message, ...optionalParams);
  }

  warn(message: any, ...optionalParams: any[]) {
    this.warn(message, ...optionalParams);
  }
}
