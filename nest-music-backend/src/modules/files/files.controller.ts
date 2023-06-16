import { Controller, Delete, Get, Post, Req, Res, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { FilesService } from './files.service';
import { storageConfig } from '../../assets/configs/storage.config';
import { Request, Response } from 'express';
import { MulterError } from 'multer';
import { ResponseMessage } from '../../assets/interfaces/response.interface';
@Controller()
export class FilesController {

    constructor(
        private _fileService: FilesService
    ) { }

    @Get('files_service_status')
    getFileServiceStatus(): any {
        return {status1: `from file service ${this._fileService.fileServiceStatus()}`};
    }

    @Get('playlists')
    getAllPlaylists(): string[] | void {
        return this._fileService.getPlaylistsListing();
    }

    @Get('musics')
    getMusicsOfPlaylist(@Req() req: Request): string[] {
        return this._fileService.getMusicFilesListing(req);
    }

    @Get()
    getMusicFile(@Req() req: Request, @Res() res: Response) {
        return this._fileService.getSavedFileFromServer(req, res);
    }

    @Post('createPlaylist')
    createNewPlaylist(@Req() req: Request): ResponseMessage {
        return this._fileService.createNewPlaylistFolder(req);
    }

    @Delete('deletePlaylist')
    deletePlaylist(@Req() req: Request): ResponseMessage {
        return this._fileService.deletePlaylistFolder(req);
    }

    @Delete('deleteFile')
    deleteFile(@Req() req: Request): ResponseMessage {
        return this._fileService.deleteFileFromFolder(req);
    }

    @Post('updatePlaylistName')
    updatePlaylistName(@Req() req: Request):ResponseMessage {
        return this._fileService.updatePlaylistName(req);
    }

    @Post('updateFileName')
    updateFileName(@Req() req: Request): ResponseMessage {
        return this._fileService.updateFileName(req);
    }

    @Post('upload')
    @UseInterceptors(FilesInterceptor('files', undefined, {
        storage: storageConfig,
        fileFilter: (req: Request, files: Express.Multer.File, callback) => {
            if (files.originalname.match(/^.*\.(mp3|aac|mp4|m4a|flac)$/))
                callback(null, true);
            else callback(new MulterError('LIMIT_UNEXPECTED_FILE', 'audio'), false);
        }
    }))
    async fileUpload(@UploadedFiles() files: Express.Multer.File[], @Req() req: Request): Promise<ResponseMessage | void> {
        return this._fileService.saveFiles(files, req);
    }

    @Delete('deleteAllData') 
    deleteAllData(): ResponseMessage {
        return this._fileService.deleteAllData();
    }
}
