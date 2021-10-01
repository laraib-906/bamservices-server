import { Controller, Get, Post, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';
import l, { logger } from 'src/server/common/logger';
import { HelperService } from 'src/server/services/helper.service';
import { manageError } from 'src/server/services/response.service';
import { BaseController } from '../../common/_base.controller';
import { AuthService } from './auth.service';

@Controller()
export class AuthController extends BaseController {

    constructor(private authService: AuthService) { super(); }

    @Post("/login")
    async login(@Req() req: Request, @Res() res: Response): Promise<void> {
        try {
            const response = await this.authService.login(req.body);
            res.cookie('token', response.accessToken);
            console.log('tookeen',response.accessToken)
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


    @Get("/me")
    async getLoggedInUser(@Req() req: Request, @Res() res: Response): Promise<void> {
        try {
            const helperService = new HelperService();
            super.response(res, helperService.tranformMeData(req.user), 200, "Successfully fetched user info");
        }
        catch (error) {
            logger.error(error);
            const err = manageError(error);
            l.error(`Error in login, err code: ${400}`);
            l.error(err.message);
            super.response(res, '', err.code, err.message);
        }
    }


    @Post("/forgot-password")    
    async forgotPassword(@Req() req: Request, @Res() res: Response): Promise<void> {
        try {
            const user = await this.authService.forgotPassword(req.body);
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


    @Post("/reset-password")
    async resetPassword(@Req() req: Request, @Res() res: Response): Promise<void> {
        try {
            const user = await this.authService.resetPassword(req.body.token, req.body.password);
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
