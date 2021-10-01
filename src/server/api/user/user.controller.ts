import { Controller, Post, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';
import l, { logger } from 'src/server/common/logger';
import { manageError } from 'src/server/services/response.service';
import { BaseController } from '../../common/_base.controller';
import { UserService } from './user.service';

@Controller()
export class UserController extends BaseController {

    constructor(private userService: UserService) { super(); }

    /**
     * @description Create new User
    */

    @Post()
    async create(@Req() req: Request, @Res() res: Response): Promise<void> {
        try {
            const user = await this.userService.create(req.body);
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
