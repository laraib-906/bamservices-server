import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { IUser } from 'src/server/types/user';

@Injectable()
export class UserService {


    constructor(@InjectModel('User') private readonly user: Model<IUser>) {}

    /**
	 * Create a new User
	 * @param userData 
	 * @returns 
	 */
	async create(userData: IUser): Promise<IUser> {
		const userInstance = new this.user(userData);
		return userInstance.save();
	}
}
