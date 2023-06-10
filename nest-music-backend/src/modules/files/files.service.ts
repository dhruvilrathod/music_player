import { BadRequestException, ConflictException, Injectable, NotFoundException, ServiceUnavailableException } from '@nestjs/common';
import { Request, Response } from 'express';
import { enviornment } from 'src/enviornment/enviornment';
import * as fs from 'fs';
import { ResponseMessage } from 'src/assets/interfaces';
import * as path from 'path';

const uploadFolderPath: string = __dirname + '../../../../';

@Injectable()
export class FilesService {

    fileServiceStatus(): boolean {
        return true;
    }

    createNewPlaylistFolder(req: Request) {
        if (fs.existsSync(`${enviornment.upload_dir}/${req.query.playlist}`))
            throw new ConflictException("Playlist already exists", { cause: new Error(), description: "The playlist you are trying to create already exists." });
        else fs.mkdirSync(`${enviornment.upload_dir}/${req.query.playlist}`);
        const response: ResponseMessage = {
            message: "Playlist created successfully"
        };
        return response;
    }

    deletePlaylistFolder(req: Request) {
        try {
            (req.body.playlists as string[]).map((p: string) => {
                if (fs.existsSync(`${enviornment.upload_dir}/${p}`))
                    fs.rmSync(`${enviornment.upload_dir}/${p}`, { recursive: true, force: true });
            });
            const response: ResponseMessage = {
                message: "Playlist deleted successfully"
            };
            return response;
        } catch (error) {
            throw new ServiceUnavailableException("Something went wrong", { cause: new Error(), description: error });
        }
    }

    deleteFileFromFolder(req: Request) {
        try {
            (req.body.files as string[]).map((f: string) => {
                if (fs.existsSync(`${enviornment.upload_dir}/${req.body.playlist}`))
                    fs.rmSync(`${enviornment.upload_dir}/${req.body.playlist}/${f}`, { force: true });
            });
            const response: ResponseMessage = {
                message: "Music deleted successfully"
            };
            return response;
        } catch (error) {
            throw new ServiceUnavailableException("Something went wrong", { cause: new Error(), description: error });
        }
    }

    getPlaylistsListing(): string[] {
        if (fs.readdirSync(`${enviornment.upload_dir}`) && fs.readdirSync(`${enviornment.upload_dir}`).length == 0)
            throw new NotFoundException("No Playlists Available", { cause: new Error(), description: "There are no playlists available right now." });
        return fs.readdirSync(`${enviornment.upload_dir}`);
    }

    getMusicFilesListing(req: Request): string[] {
        return fs.readdirSync(`${enviornment.upload_dir}/${req.query.playlist}`);
    }

    getSavedFileFromServer(req: Request, res: Response) {
        if (!fs.existsSync(`${enviornment.upload_dir}/${req.query.playlist}/${req.query.fileName}`))
            throw new NotFoundException("File not found", { cause: new Error(), description: "The file is not availabe" });
        return res.sendFile(path.join(uploadFolderPath, `${enviornment.upload_dir}/${req.query.playlist}/${req.query.fileName}`));
    }

    saveFiles(files: Express.Multer.File[], req: Request) {
        try {
            files.map((f: Express.Multer.File, i: number) => {
                if (!fs.existsSync(`${enviornment.upload_dir}/${req.query.playlist}/${f.originalname}`))
                    throw new BadRequestException("File not received", { cause: new Error(), description: "The file is not received by the Player" });
            })
            const response: ResponseMessage = {
                message: "Files received successfully"
            };

            return response;
        } catch (error) {
            throw new ServiceUnavailableException("Something went wrong", { cause: new Error(), description: error });
        }
    }

}


// for multiple delete of playlist and musics add logics