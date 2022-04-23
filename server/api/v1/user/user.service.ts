import { IUser } from "../../../../types/user";
import { User } from "../../../models";

export class UserService {

  /**
 * Create a new User
 * @param userData 
 * @returns 
 */
  async create(userData: IUser): Promise<IUser> {
    const userInstance = new User(userData);
    return userInstance.save();
  }
}

export default new UserService();
