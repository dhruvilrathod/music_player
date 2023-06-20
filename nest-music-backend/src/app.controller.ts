import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
    constructor(private readonly appService: AppService) { }

    // @Get()
    // root(@Res() res: Response): void {
    //     return res.sendFile(join(__dirname, '..','frontend', 'angular-music', 'index.html'));
    // }

    @Get('api/server_status')
    getServerStatus(): boolean {
        return this.appService.getServerStatus();
    }
}
