import { Delete, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { drive_v3, google } from 'googleapis';
import { IFiles, IFilesModel } from 'src/server/types/files';
import { PaginateResult } from 'mongoose-paginate-v2';
import { IMongooseDeleteObject } from '../../types/response';
const fs = require('fs');
const rimraf = require('rimraf');

@Injectable()
export class FilesService {

    private driveClient: drive_v3.Drive;

    constructor(@InjectModel('Files') private readonly fileSchema: IFilesModel<IFiles>) {
        this.driveClient = this.createDriveClient(
            process.env.GOOGLE_DRIVE_CLIENT_ID,
            process.env.GOOGLE_DRIVE_CLIENT_SECRET,
            process.env.GOOGLE_DRIVE_REDIRECT_URI,
            process.env.GOOGLE_DRIVE_REFRESH_TOKEN
        );
    }

    public async listFiles(
        page?: number,
        limit?: number
    ) : Promise<PaginateResult<IFiles>> {
        return await this.fileSchema.paginate({}, { page, limit });
    }
    
    public async createFolder(folderName: string): Promise<any> {
        return new Promise(async (resolve, reject) => {
            try {

                if (!folderName) {
                    reject({ message: "Invaild Folder name", code: 400 });
                }

                const response = await this.driveClient.files.create({
                    resource: {
                        name: folderName,
                        mimeType: 'application/vnd.google-apps.folder',
                    },
                    fields: 'id, name',
                } as any);

                resolve(response);

            } catch (error) {
                reject(error);
            }
        });
    }

    public async searchFolder(folderName: string): Promise<any> {
        return new Promise(async (resolve, reject) => {
            try {

                if (!folderName) {
                    return reject({ message: "Invaild Folder name", code: 400 });
                }
                
                await this.driveClient.files.list(
                    {
                        q: `mimeType='application/vnd.google-apps.folder' and name='${folderName}'`,
                        fields: 'files(id, name)',
                    },
                    (err, res: {data: any}) => {
                        if (err) {
                            return reject(err);
                          }
                
                          return resolve(res.data.files ? res.data.files[0] : null);
                    }
                );
            } catch (error) {
                reject(error);
            }
        });
    }


    public async uploadFile(file: Express.Multer.File, folderId?: string): Promise<IFiles> {
        return new Promise(async (resolve, reject) => {
            try {
                const uploaded = await this.driveClient.files.create({
                    requestBody: {
                        name: file.originalname,
                        mimeType: file.mimetype,
                        parents: folderId ? [folderId] : [],
                    },
                    media: {
                        mimeType: file.mimetype,
                        body: fs.createReadStream(`${file.path}`),
                    },
                });

                if(!uploaded) {
                    return reject({ message: "Error uploading file", code: 400 });
                }

                const newFile = new this.fileSchema({
                    ...uploaded.data
                });

                rimraf('uploads/*', function () { });                
                resolve(newFile.save());

            } catch (error) {
                reject(error);
            }
        });
    }

    public async getFileById(id: string): Promise<IFiles> {
        return await this.fileSchema.findOne({ id });
    }

    public async deleteFile(id: string): Promise<IMongooseDeleteObject> {
        return new Promise(async (resolve, reject) => {
            try {
                
                const deleteFile = await this.driveClient.files.delete({
                    fileId: id
                });

                if(!deleteFile) {
                    return reject({ message: "Error Deleting file", code: 400 });
                }

                const deleteIntentRes = await this.fileSchema.deleteOne({ id });

                resolve(deleteIntentRes);

            } catch (error) {
                reject(error);
            }
        });
    }


    private createDriveClient(clientId: string, clientSecret: string, redirectUri: string, refreshToken: string) {
        const client = new google.auth.OAuth2(clientId, clientSecret, redirectUri);

        client.setCredentials({ refresh_token: refreshToken });

        return google.drive({
            version: 'v3',
            auth: client,
        });
    }

}
