import { Request, Response } from "express";
import l, { logger } from "../../../common/logger";
import { manageError } from "../../../helper/response.helper";
import UserService from "./user.service";
import { BaseController } from "../_base.controller";

export class Controller extends BaseController {

    async create(req: Request, res: Response): Promise<void> {
        try {
            const user = await UserService.create(req.body);
            super.response(res, user, 200, "User created Successfully!");
        }
        catch (error) {
            logger.error(error);
            const err = manageError(error);
            l.error(`Error in creating user, err code: ${400}`);
            l.error(err.message);
            super.response(res, '', err.code, err.message);
        }
    }
}

export default new Controller();
