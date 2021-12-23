import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { IFiles, IFilesModel } from 'src/server/types/files';
import { PaginateResult } from 'mongoose-paginate-v2';
import { IMongooseDeleteObject } from '../../types/response';
import { firebaseService } from 'src/server/services/firebase.service';

const fs = require('fs');
const rimraf = require('rimraf');

@Injectable()
export class FilesService {

    private driveClient;


    constructor(@InjectModel('Files') private readonly fileSchema: IFilesModel<IFiles>) { }

    public async listFiles(
        page?: number,
        limit?: number
    ): Promise<PaginateResult<IFiles>> {
        return await this.fileSchema.paginate({}, { page, limit });
    }

    public async uploadFile(file: Express.Multer.File): Promise<IFiles> {
        return new Promise(async (resolve, reject) => {
            try {
                const response = await firebaseService.uploadFile(file);

                if (!response) {
                    return reject({ message: "Error uploading file", code: 400 });
                }

                const fileResponse = response[0];
                const responseDetails = {
                    fileId: fileResponse.id,
                    metaDataId: fileResponse.metadata.id,
                    name: file.originalname,
                    filename: fileResponse.name,
                    bucket: fileResponse.metadata.bucket,
                    timeCreated: fileResponse.metadata.mediaLink,
                    downloadLink: fileResponse.metadata.mediaLink,
                }


                const newFile = new this.fileSchema({
                    ...responseDetails
                });

                rimraf('uploads/*', function () { });
                resolve(newFile.save());

            } catch (error) {
                reject(error);
            }
        });
    }

    public async getFileById(id: string): Promise<IFiles> {
        return await this.fileSchema.findOne({ _id: id });
    }

    public async deleteFile(id: string): Promise<IMongooseDeleteObject> {
        return new Promise(async (resolve, reject) => {
            try {

                const fileDetails = await this.getFileById(id);

                const response = await firebaseService.removeFile(fileDetails.filename);

                if (!response) {
                    return reject({ message: "Error Deleting file", code: 400 });
                }

                const deleteIntentRes = await this.fileSchema.deleteOne({ _id: id });
                resolve(deleteIntentRes);

            } catch (error) {
                reject(error);
            }
        });
    }
}
