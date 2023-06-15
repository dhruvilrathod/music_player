import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response } from 'express';
import * as path from 'path';

@Injectable()
export class ErrorMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: () => void) {
    console.log(path.join(__dirname, `../../../frontend/angular-music/index.html`));
    res.sendFile(path.join(__dirname, `../../../frontend/angular-music`));
    next();
  }
}
