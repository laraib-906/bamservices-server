import { IMeUser } from "../types/me";
import { IUser } from "../types/user";

/*
 *	Helper methods will be here
*/
export class HelperService {

    tranformMeData(user: IUser) {
        return {
            id: user['_id'],
            firstName: user['firstName'],
            lastName: user['lastName'],
            email: user['email'],
            phone: user['phone'],
            company: user['company'],
            city: user['city'],
            country: user['country'],
            postalCode: user['postalCode'],
	        profilePicture: user['profilePicture'],
	        role: user['role'],
        } as IMeUser;
    }

}

export default new HelperService();