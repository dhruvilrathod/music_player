import { Controller, Delete, Get, Post, Req, Res, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { FilesService } from './files.service';
import { storageConfig } from 'src/assets/configs';
import { Request, Response } from 'express';
import { MulterError } from 'multer';
import { ResponseMessage } from 'src/assets/interfaces';

@Controller('files')
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
}