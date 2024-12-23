import {  Injectable, InternalServerErrorException } from '@nestjs/common';
import * as fs from 'fs';
// import { MusicHistory } from '../../assets/interfaces/music-history.interface';
// import { ResponseMessage } from '../../assets/interfaces/response.interface';

import { enviornment } from '../../environment/environment';

import { MusicHistory, ResponseMessage } from '../../assets/interfaces';

const cacheFolderPath: string = __dirname + '../../../../';
const cacheFileName: string = 'music_history.json';

@Injectable()
export class PlayerService {
    playerServiceStatus(): boolean {
        return true;
    }

    getDetailsFromCacheFile(): ResponseMessage | MusicHistory {
        if (!fs.existsSync(`${enviornment.cache_dir}/${cacheFileName}`)) {
            const response: ResponseMessage = {
                code: 1
            };
            return response;
        }
        else {
            try {
                let cacheFile = JSON.parse(fs.readFileSync(`${enviornment.cache_dir}/${cacheFileName}`, { encoding: 'utf8' }));
                return cacheFile;
            } catch (err) {
                return {};
            }
        }
    }

    createOrUpdateCacheFile(body): ResponseMessage {
        try {
            fs.writeFileSync(`${enviornment.cache_dir}/${cacheFileName}`, JSON.stringify(body));
        } catch (err) {
            throw new InternalServerErrorException("Something went wrong", err);
        }
        const response: ResponseMessage = {
            code: 1
        };
        return response;
    }

    deleteCacheFile(): ResponseMessage {
        try {
            fs.rmSync(`${enviornment.cache_dir}/${cacheFileName}`, { force: true });
        } catch (err) {
            throw new InternalServerErrorException("Something went wrong", err);
        }
        const response: ResponseMessage = {
            code: 1
        };
        return response;
    }
}
