import { Document, PaginateModel } from "mongoose";

export interface IUser extends Document {
	firstName: string;
	lastName: string;
	email: string;
	phone: string;
	company: string;
	address?: string;
	suite?: string;
	city?: string;
	country?: string;
	postalCode?: string;
	profilePicture?: string;
	password?: string;
	provider?: string;
	salt?: string;
	role?: string;
	resetPasswordToken?: string;
	facebook?: {};
	twitter?: {};
	google?: {};
	github?: {};
}
export interface IUserModel<T extends Document> extends PaginateModel<T> { }
