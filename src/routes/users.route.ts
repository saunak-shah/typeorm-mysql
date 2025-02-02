import { Router } from "express";
import {
  createUser,
  listUsers,
  singleUser,
  updateUser,
  deleteUser,
} from "../controller/users.controller";
import {authenticate, authorize} from '../middlewares/authMiddleware'
import { validate } from "../middlewares/validate";
import { userSchema } from "../schema/users";

const routes = Router();
 
routes.post("/", [authenticate], validate(userSchema), authorize(['Admin']), createUser);
routes.get("/", [authenticate], listUsers);
routes.get("/:id", [authenticate], singleUser);
routes.put("/:id",[authenticate], validate(userSchema), authorize(['Admin']), updateUser);
routes.delete("/:id", [authenticate], deleteUser);

export default routes;
