import { Controller, Delete, Get, Param, Post, Req, Res, UploadedFile, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { Request, Response } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import l, { logger } from 'src/server/common/logger';
import HelperService from 'src/server/services/helper.service';
import { manageError } from 'src/server/services/response.service';
import { BaseController } from 'src/server/common/_base.controller';
import { FilesService } from './files.service';
import path = require('path');
import { v4 as uuidv4 } from 'uuid';
import { Observable } from 'rxjs';


@Controller()
export class FilesController extends BaseController {

    constructor(private fileService: FilesService) { super(); }

    @Get()
    async getFilesList(@Req() req: Request, @Res() res: Response) {
        try {
            const response = await this.fileService.listFiles(
                +(req.query.page || 1),
                +(req.query.limit || 10),
            );
            super.response(res, response, 200, "");
        }
        catch (error) {
            logger.error(error);
            const err = manageError(error);
            l.error(`Error in login, err code: ${400}`);
            l.error(err.message);
            super.response(res, '', err.code, err.message);
        }
    }

    @Post()
    @UseInterceptors(FileInterceptor('file', {
        storage: diskStorage({
            destination: process.env.UPLOADED_FILES_PATH || './uploads',
            filename: (req, file, cb) => {
                const filename: string = path.parse(file.originalname).name.replace(/\s/g, '') + uuidv4();
                const extension: string = path.parse(file.originalname).ext;
                cb(null, `${filename}${extension}`)
            }
        }),
    }))
    async uploadFile(@UploadedFile() file: Express.Multer.File, @Req() req: Request, @Res() res: Response) {
        try {
            let folder = await this.fileService.searchFolder(process.env.GOOGLE_DRIVE_FOLDER_NAME);
            if (!folder) {
                folder = await this.fileService.createFolder(process.env.GOOGLE_DRIVE_FOLDER_NAME);
            }
            let response = await this.fileService.uploadFile(file, folder.id);
            super.response(res, response, 200, "Successfully Uploaded File");
        }
        catch (error) {
            logger.error(error);
            const err = manageError(error);
            l.error(`Error in login, err code: ${400}`);
            l.error(err.message);
            super.response(res, '', err.code, err.message);
        }
    }

    @Post('/download')
    async downloadFile(@Req() req: Request, @Res() res: Response) {
        try {
            const response = await this.fileService.downloadFile(req.body);
            super.response(res, response, 200, "File Downloaded Successfully");
        }
        catch (error) {
            logger.error(error);
            const err = manageError(error);
            l.error(`Error in login, err code: ${400}`);
            l.error(err.message);
            super.response(res, '', err.code, err.message);
        }
    }

    @Get(':id')
    async getFileByID(@Param() param, @Req() req: Request, @Res() res: Response) {
        console.log(param);
        try {
            const response = await this.fileService.getFileById(param.id)
            super.response(res, response, 200, "");
        }
        catch(error) {
            logger.error(error);
            const err = manageError(error);
            l.error(`Error in login, err code: ${400}`);
            l.error(err.message);
            super.response(res, '', err.code, err.message);
        }
    }

    @Delete(':id')
    async deleteFile(@Param() param, @Req() req: Request, @Res() res: Response) {
        try {
            const response = await this.fileService.deleteFile(
                param.id
            );
            super.response(res, response, 200, "Successfully deleted File");
        }
        catch (error) {
            logger.error(error);
            const err = manageError(error);
            l.error(`Error in login, err code: ${400}`);
            l.error(err.message);
            super.response(res, '', err.code, err.message);
        }
    }

}
