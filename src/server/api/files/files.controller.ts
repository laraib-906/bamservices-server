import { Controller, Post, UploadedFile, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { Observable, of } from 'rxjs';
import { BaseController } from 'src/server/common/_base.controller';
import { FilesService } from './files.service';
import path = require('path');
import { v4 as uuidv4 } from 'uuid';

const storage = {
    storage: diskStorage({
        destination: process.env.UPLOADED_FILES_PATH || './uploads/files',
        filename: (req, file, cb) => {
            const filename: string = path.parse(file.originalname).name.replace(/\s/g, '') + uuidv4();
            const extension: string = path.parse(file.originalname).ext;

            cb(null, `${filename}${extension}`)
        }
    }),
}

@Controller()
export class FilesController extends BaseController {

    constructor(private fileService: FilesService) { super(); }

    @Post()
    @UseInterceptors(
        FileInterceptor('file', storage),
    )
    uploadfile(@UploadedFile() file): Observable<Object> {
        console.log(file);
        return of({ imagePath: file.path });
    }
}
