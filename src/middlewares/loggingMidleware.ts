import { Injectable, NestMiddleware, Logger } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';

@Injectable()
export class LoggingMiddleware implements NestMiddleware {
  logger = new Logger('Response');

  constructor() {}
  use(req: Request, res: Response, next: NextFunction) {
    const { method, url } = req;
    const reqTime = Date.now();

    res.on('finish', () => {
      const { statusCode } = res;

      const responseTime = Date.now() - reqTime;

      if (statusCode === 201 || statusCode === 200) {
        const logMessage = `👌👌  ${method} ${url} ${statusCode} | ${responseTime}ms -  👌👌`;

        this.logger.log(logMessage);
      }
    });

    next();
  }
}
