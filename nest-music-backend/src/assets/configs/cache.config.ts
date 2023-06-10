import { Request } from "express";
import { diskStorage } from "multer";
import { enviornment } from "src/enviornment/enviornment";
import * as fs from "fs";

export const cacheConfig = diskStorage({
    destination: (req: Request, file: Express.Multer.File, callback) => {
        const dir = `${enviornment.upload_dir}/${req.query.playlist}`;
        if (!fs.existsSync(dir))
            fs.mkdirSync(dir);
        callback(null, dir);
    },
    filename: (req: Request, file: Express.Multer.File, callback) => {
        callback(null, file.originalname);
    }
})
