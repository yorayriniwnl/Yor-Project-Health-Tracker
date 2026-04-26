import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';

@Injectable()
export class AuditContextMiddleware implements NestMiddleware {
  use(req: Request, _res: Response, next: NextFunction) {
    req.headers['x-audit-ip'] = req.ip;
    req.headers['x-audit-user-agent'] = req.get('user-agent') ?? '';
    next();
  }
}
