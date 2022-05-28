import logger from "../../../common/loggerService.js";
import { manageError } from "../../../helper/response.helper.js";
import UserService from "./user.service.js";
import { BaseController } from "../_base.controller.js";

export class Controller extends BaseController {

    async create(req, res) {
        try {
            const user = await UserService.create(req.body);
            super.response(res, user, 200, "User created Successfully!");
        }
        catch (error) {
            console.error(error);
            const err = manageError(error);
            logger.error(`Error in creating user, err code: ${400}`);
            logger.error(err.message);
            super.response(res, '', err.code, err.message);
        }
    }
}

export default new Controller();
