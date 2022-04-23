import { Request, Response } from "express";
import l, { logger } from "../../../common/logger";
import { manageError } from "../../../helper/response.helper";
import AuthService from "./auth.service";
import { HelperService } from "../../../services/helper.service";
import { BaseController } from "../_base.controller";
import { IUser } from "../../../../types/user";

export class Controller extends BaseController {

    /**
     * Login User
     * @param req 
     * @param res 
     */
    async login(req: Request, res: Response): Promise<void> {
        try {
            const response = await AuthService.login(req.body);
            res.cookie('token', response.accessToken);
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


    /**
     * Login User
     * @param req 
     * @param res 
     */
    async getLoggedInUser(req: Request, res: Response): Promise<void> {
        try {
            const helperService = new HelperService();
            super.response(res, helperService.tranformMeData(req.user as IUser), 200, "");
        }
        catch (error) {
            logger.error(error);
            const err = manageError(error);
            l.error(`Error in getting user info, err code: ${400}`);
            l.error(err.message);
            super.response(res, '', err.code, err.message);
        }
    }

     /**
     * User forgots Password
     * @param req 
     * @param res 
     */   
    async forgotPassword(req: Request, res: Response): Promise<void> {
        try {
            const user = await AuthService.forgotPassword(req.body);
            super.response(res, user, 200, "Email sent Successfully!");
        }
        catch (error) {
            logger.error(error);
            const err = manageError(error);
            l.error(`Error in sending email for resetting password, err code: ${400}`);
            l.error(err.message);
            super.response(res, '', err.code, err.message);
        }
    }

    /**
     * Reset User Password
     * @param req 
     * @param res 
     */
    async resetPassword(req: Request, res: Response): Promise<void> {
        try {
            const user = await AuthService.resetPassword(req.body.token, req.body.password);
            super.response(res, user, 200, "Password reset Successfully!");
        }
        catch (error) {
            logger.error(error);
            const err = manageError(error);
            l.error(`Error in resetting password, err code: ${400}`);
            l.error(err.message);
            super.response(res, '', err.code, err.message);
        }
    }

}

export default new Controller();
