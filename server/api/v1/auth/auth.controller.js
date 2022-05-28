import logger from "../../../common/loggerService.js";
import { manageError } from "../../../helper/response.helper.js";
import AuthService from "./auth.service.js";
import { HelperService } from "../../../services/helper.service.js";
import { BaseController } from "../_base.controller.js";

export class Controller extends BaseController {

    /**
     * Login User
     * @param req 
     * @param res 
     */
    async login(req, res) {
        try {
            const response = await AuthService.login(req.body);
            res.cookie('token', response.accessToken);
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

    /**
     * Login User
     * @param req 
     * @param res 
     */
    async getLoggedInUser(req, res) {
        try {
            const helperService = new HelperService();
            super.response(res, helperService.tranformMeData(req.user), 200, "");
        }
        catch (error) {
            console.error(error);
            const err = manageError(error);
            logger.error(`Error in login, err code: ${400}`);
            logger.error(err.message);
            super.response(res, '', err.code, err.message);
        }
    }

     /**
     * User forgots Password
     * @param req 
     * @param res 
     */   
    async forgotPassword(req, res) {
        try {
            const user = await AuthService.forgotPassword(req.body);
            super.response(res, user, 200, "Email sent Successfully!");
        }
        catch (error) {
            console.error(error);
            const err = manageError(error);
            logger.error(`Error in login, err code: ${400}`);
            logger.error(err.message);
            super.response(res, '', err.code, err.message);
        }
    }

    /**
     * Reset User Password
     * @param req 
     * @param res 
     */
    async resetPassword(req, res) {
        try {
            const user = await AuthService.resetPassword(req.body.token, req.body.password);
            super.response(res, user, 200, "Password reset Successfully!");
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
