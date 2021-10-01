import { Injectable } from '@nestjs/common';
import { IloginResponse } from 'src/server/types/auth';
import { MailDataRequired } from "@sendgrid/helpers/classes/mail";
import { MailService } from 'src/server/services/mail.service';
import { IUser } from 'src/server/types/user';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {

    constructor(
        @InjectModel('User') private readonly user: Model<IUser>,
        private readonly jwtService: JwtService
    ) {}

    login(credentials): Promise<IloginResponse> { 
        return new Promise(async (resolve, reject) => {
            const { email, password } = credentials;
            try {
                // TODO: Fix typing
                const user = await this.user.findOne({ email });

                if (!user) {
                    return reject({ message: 'User not exists', code: 401 });
                }

                const passwordIsValid = (user as any).authenticate(password);

                if (!passwordIsValid) {
                    return reject({ message: 'Email or Password invalid!', code: 401 });
                }

                const token = this.jwtService.sign({ id: user.id }, {
                    expiresIn: 604800, // 1 week hours
                    algorithm: 'HS256'
                });

                resolve({
                    id: user._id,
                    email: user.email,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    accessToken: token
                })

            }
            catch (err) {
                reject(err);
            }
        })

    }


    async forgotPassword({ email }) {
        return new Promise(async (resolve, reject) => {
            const user = await this.user.findOne({ email });

            if (!user) {
                return reject({ message: 'No user found with that email address', code: 401 });
            }

            const token = this.jwtService.sign({ id: user.id }, {
                expiresIn: 7200, // 2 hours
                algorithm: 'HS256'
            });

            user.resetPasswordToken = token;
            user.save();

            // TODO: send email to the user
            const host = process.env.APP_HOST;
            const mailOptions: MailDataRequired = {
                to: user.email,
                from: process.env.APP_EMAIL_SENDER,
                subject: 'Password Reset',
                html: '<h3>You are receiving this because you (or someone else) have requested the reset of the password for your account.</h3>' +
                  '<h3>Please click on the following link, or paste this into your browser to complete the process:</h3> <br/>' +
                   `<a href="${host}/reset-password?token=${token}">Click Here !!!</a> <br/> <br/>` +
                  '<h3>If you did not request this, please ignore this email and your password will remain unchanged.</h3> <br/>'
            };
            const mailService = new MailService();
            mailService.sendEmail(mailOptions)
                .then((success) => {
                    resolve(success);
                })
                .catch((error) => {
                    reject(error)
                });
        })
    }

    resetPassword(token, password) {
        return new Promise(async (resolve, reject) => {
            const user = await this.user.findOne({ resetPasswordToken: token });

            if (!user) {
                return reject({ message: 'Unauthorized reset password request', code: 401 });
            }

            user.password = password;
            user.resetPasswordToken = undefined;

            user.save();

            const mailOptions: MailDataRequired = {
                to: user.email,
                from: process.env.APP_EMAIL_SENDER,
                subject: 'Password Reset',
                html: '<h3>Hello,</h3>' +
                      '<h3>This is a confirmation that the password for your account ' + user.email + ' has just been changed.</h3>'
            };
            const mailService = new MailService();
            mailService.sendEmail(mailOptions)
                .then((success) => {
                    resolve(success);
                })
                .catch((error) => {
                    reject(error)
                });
        });
    }

}
