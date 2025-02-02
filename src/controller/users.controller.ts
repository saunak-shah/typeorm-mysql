import { generateToken } from './../utils/authUtils';
import { NextFunction, Request, Response } from "express";
import RedisUtility from "../utils/RedisUtility";
import { UserService } from "../services/UserService";
import { InternalException } from "../exceptions/internal-exception";
import { ErrorCode } from "../exceptions/root";
import { BadRequestsException } from '../exceptions/bad-requests';

/**
 * Controller for creating a new user.
 */
export const createUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // check email already exists.
    const userExists = await UserService.getUserByEmail(req.body.email);
    if(userExists){
      next(new BadRequestsException('Email already exists.', ErrorCode.USER_ALREADY_EXISTS));
      return;
    }

    // insert user
    const user = await UserService.createUser(req.body);
    const token: string = generateToken(user.id, user.role);

    res.json({
      success: true,
      data: {
        ...user,
        token
      },
    });
  } catch (error) {
    console.error("Error inserting user:", error);
    next(new InternalException('Error inserting user!', error, ErrorCode.INTERNAL_EXCEPTION))
  }
};

/**
 * Controller for listing all users.
 */
export const listUsers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    let users: any = await RedisUtility.getJSON("users_data");

    if (!users || (users && !users[0])) {
      users = await UserService.getAllUsers();
      await RedisUtility.setJSON("users_data", users);
    }

    res.json({
      success: true,
      data: users,
    });
  } catch (error) {
    console.error("Error listing users:", error);
    next(new InternalException('Error listing users!', error, ErrorCode.INTERNAL_EXCEPTION))
  }
};

/**
 * Controller for updating a user.
 */
export const updateUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    // check user already exists.
    const userExists = await UserService.getUserById(parseInt(id));
    if(!userExists){
      next(new BadRequestsException('User already exists.', ErrorCode.USER_NOT_FOUND));
      return;
    }

    const updatedUser = await UserService.updateUser(parseInt(id), req.body);
    // Check if any row was updated
    if (!updatedUser) {
      res.status(404).json({
        success: false,
        message: "User not found or no changes made",
      });
      return;
    }

    RedisUtility.deleteKey(`user_${id}`);
    RedisUtility.deleteKey(`users_data`);

    res.json({
      success: true,
      data: updatedUser,
    });
  } catch (error) {
    console.error("Error updating user:", error);
    next(new InternalException('Error listing users!', error, ErrorCode.INTERNAL_EXCEPTION))
  }
};

/**
 * Controller for fetching a single user.
 */
export const singleUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    let user = await RedisUtility.getJSON(`user_${id}`);

    if (!user) {
      user = await UserService.getUserById(parseInt(id));
      if(!user){
        throw new BadRequestsException('User not found.', ErrorCode.USER_NOT_FOUND)
      }
      // Check if any row was updated
      if (!user) {
        res.status(404).json({
          success: false,
          message: "User not found or no changes made",
        });
        return;
      }
      await RedisUtility.setJSON(`user_${id}`, user);
    }

    res.json({
      success: true,
      data: user,
    });
  } catch (error) {
    console.error("Error updating user:", error);
    next(new InternalException('Error listing users!', error, ErrorCode.INTERNAL_EXCEPTION))
  }
};

/**
 * Controller for deleting a user.
 */
export const deleteUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    const deleted = await UserService.deleteUser(id);
    if (!deleted) {
        res
        .status(404)
        .json({ success: false, message: "User not found" });
        return;
    }
    await RedisUtility.deleteKey(`user_${id}`);
    await RedisUtility.deleteKey(`users_data`);

    res.json({
      success: true,
      message: "User deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting user:", error);
    next(new InternalException('Error listing users!', error, ErrorCode.INTERNAL_EXCEPTION))
  }
};
