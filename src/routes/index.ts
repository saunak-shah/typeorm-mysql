import {Router} from 'express';
import usersRouter from "./users.route";

const routes = Router();

// version 1 routes
routes.use("/users", usersRouter);

export default routes;