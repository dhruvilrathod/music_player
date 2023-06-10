import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  root(): string {
    return this.appService.getHello();
  }

  @Get('server_status') 
  getServerStatus(): boolean {
    return this.appService.getServerStatus();
  } 
}
