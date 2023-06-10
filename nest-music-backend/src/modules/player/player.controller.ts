import { Body, Controller, Delete, Get, Post, Req, Res } from '@nestjs/common';
import { PlayerService } from './player.service';
import { MusicHistory, ResponseMessage } from 'src/assets/interfaces';

@Controller('player')
export class PlayerController {
    constructor (
        private _playerService: PlayerService
    ) { }

    @Get('history')
    getPlayerHistory(): ResponseMessage | MusicHistory {
        return this._playerService.getDetailsFromCacheFile();
    }

    @Post('addToCache')
    createOrUpdateCacheFile(@Body() body): ResponseMessage {
        return this._playerService.createOrUpdateCacheFile(body);
    }

    @Delete('clearCache')
    clearCache(): ResponseMessage {
        return this._playerService.deleteCacheFile();
    }
}
