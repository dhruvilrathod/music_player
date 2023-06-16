import { Body, Controller, Delete, Get, Post } from '@nestjs/common';
import { PlayerService } from './player.service';
import { MusicHistory } from '../../assets/interfaces/music-history.interface';
import { ResponseMessage } from '../../assets/interfaces/response.interface';
@Controller()
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
