import { User } from "../../../models/user.model.js";

export class UserService {

  /**
 * Create a new User
 * @param userData 
 * @returns 
 */
  async create(userData) {
    const userInstance = new User(userData);
    return userInstance.save();
  }
}

export default new UserService();
