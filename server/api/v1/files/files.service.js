import { Files } from "../../../models/files.model.js";
import firebaseService from "../../../services/firebase.service.js";
import rimraf from "rimraf";

export class FilesService {

  constructor() { }

  async listFiles(
    page,
    limit
  ) {
    return await Files.paginate({}, { page, limit });
  }

  async uploadFile(file) {
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


        const newFile = new Files({
          ...responseDetails
        });

        rimraf('uploads/*', function () { });
        return resolve(newFile.save());

      } catch (error) {
        return reject(error);
      }
    });
  }

  async getFileById(id) {
    return await Files.findOne({ _id: id });
  }

  async deleteFile(id) {
    return new Promise(async (resolve, reject) => {
      try {

        const fileDetails = await this.getFileById(id);

        const response = await firebaseService.removeFile(fileDetails.filename);

        if (!response) {
          return reject({ message: "Error Deleting file", code: 400 });
        }

        const deleteIntentRes = await Files.findOneAndDelete({ _id: id });
        return resolve(deleteIntentRes);

      } catch (error) {
        return reject(error);
      }
    });
  }

}

export default new FilesService();
