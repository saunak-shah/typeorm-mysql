import { AppDataSource } from "../data-source";
import { Users } from "../entities/Users";

export class UserService {
    /**
     * Create a new user in the database.
     */
    static async createUser(userData: Partial<Users>){
        const repo = AppDataSource.getRepository(Users);
        const user = repo.create(userData);
        return await repo.save(user);
    }

    /**
   * Fetch all users from the database.
   */
  static async getAllUsers() {
    return await AppDataSource.getRepository(Users).find();
  }

  /**
   * Fetch a single user by ID.
   */
  static async getUserById(id: number) {
    return await AppDataSource.getRepository(Users).findOne({ where: { id } });
  }

  /**
   * Fetch a single user by email.
   */
  static async getUserByEmail(email: string) {
    return await AppDataSource.getRepository(Users).findOne({ where: { email } });
  }

  /**
   * Update an existing user.
   */
  static async updateUser(id: number, userData: Partial<Users>) {
    const repo = AppDataSource.getRepository(Users);
    const result = await repo.update(id, userData);
    return result.affected ? await repo.findOne({ where: { id } }) : null;
  }

  /**
   * Delete a user by ID.
   */
  static async deleteUser(id: string) {
    const repo = AppDataSource.getRepository(Users);
    const result = await repo.delete(id);
    return result.affected ? true : false;
  }
}