import { Request, Response } from "express";
import l, { logger } from "../../../common/logger";
import { manageError } from "../../../helper/response.helper";
import FilesService from "./files.service";
import { BaseController } from "../_base.controller";

export class Controller extends BaseController {

  async getFilesList(req: Request, res: Response): Promise<void> {
    try {
      const response = await FilesService.listFiles(
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

  async uploadFile(req: Request, res: Response) {
    try {
      let response = await FilesService.uploadFile(req.file);
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

  async getFileByID(req: Request, res: Response) {
    try {
      const response = await FilesService.getFileById(req.params.id)
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

  async deleteFile(req: Request, res: Response) {
    try {
      const response = await FilesService.deleteFile(
        req.params.id
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

export default new Controller();
