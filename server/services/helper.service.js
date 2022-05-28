export class HelperService {
  tranformMeData(user) {
    return {
      id: user["_id"],
      firstName: user["firstName"],
      lastName: user["lastName"],
      email: user["email"],
      phone: user["phone"],
      company: user["company"],
      city: user["city"],
      country: user["country"],
      postalCode: user["postalCode"],
      profilePicture: user["profilePicture"],
      role: user["role"],
    };
  }
}

export default new HelperService();
