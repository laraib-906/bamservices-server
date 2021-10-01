import { Injectable, NestMiddleware } from '@nestjs/common';
import { BaseController } from '../common/_base.controller';
import { Model } from 'mongoose';
import { IUser } from '../types/user';
import { InjectModel } from '@nestjs/mongoose';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthMiddleware implements NestMiddleware {

    constructor(
        @InjectModel('User') private readonly user: Model<IUser>,
        private readonly jwtService: JwtService
    ) { }
    
    /*
        * Attaches the user object to the request if authenticated
        * Otherwise returns 403
    */
    async use(req, res, next) {
        if (!req.headers.authorization) {
            if(!res.cookie.token) {
                return BaseController.prototype.response(res, {}, 401, "Token is required");
            }else {
                req.headers.authorization = res.cookie.token;
            }
        }

        if (!req.headers.authorization.match(/Bearer\s(\S+)/)) {
            return BaseController.prototype.response(res, {}, 401, "Unsupported token");
        }

        const [jwtTokenType, jwtTokenValue] = req.headers.authorization.split(' ');

        const userAuthToken = this.jwtService.verify(jwtTokenValue);

        try {
            const user = await this.user.findOne({ _id: userAuthToken.id });
            req.user = user;
            next();
        } catch (e) {
            return BaseController.prototype.response(res, {}, 401, "Not Authorized");
        }
    }
}
