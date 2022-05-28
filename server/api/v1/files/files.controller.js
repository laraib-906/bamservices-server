import logger from "../../../common/loggerService.js";
import { manageError } from "../../../helper/response.helper.js";
import FilesService from "./files.service.js";
import { BaseController } from "../_base.controller.js";

export class Controller extends BaseController {

  async getFilesList(req, res) {
    try {
      const response = await FilesService.listFiles(
        +(req.query.page || 1),
        +(req.query.limit || 10),
      );
      super.response(res, response, 200, "");
    }
    catch (error) {
      console.error(error);
      const err = manageError(error);
      logger.error(`Error in login, err code: ${400}`);
      logger.error(err.message);
      super.response(res, '', err.code, err.message);
    }
  }

  async uploadFile(req, res) {
    try {
      let response = await FilesService.uploadFile(req.file);
      super.response(res, response, 200, "Successfully Uploaded File");
    }
    catch (error) {
      const err = manageError(error);
      logger.error(`Error in login, err code: ${400}`);
      logger.error(err.message);
      super.response(res, '', err.code, err.message);
    }
  }

  async getFileByID(req, res) {
    try {
      const response = await FilesService.getFileById(req.params.id)
      super.response(res, response, 200, "");
    }
    catch (error) {
      console.error(error);
      const err = manageError(error);
      logger.error(`Error in login, err code: ${400}`);
      logger.error(err.message);
      super.response(res, '', err.code, err.message);
    }
  }

  async deleteFile(req, res) {
    try {
      const response = await FilesService.deleteFile(
        req.params.id
      );
      super.response(res, response, 200, "Successfully deleted File");
    }
    catch (error) {
      console.error(error);
      const err = manageError(error);
      logger.error(`Error in login, err code: ${400}`);
      logger.error(err.message);
      super.response(res, '', err.code, err.message);
    }
  }

}

export default new Controller();
