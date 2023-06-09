import { Router } from "express";
import { signIn, signUp } from "../controllers/user.controller";

const userRouter: Router = Router();

userRouter.post("/sign-up", signUp);
userRouter.post("/sign-in", signIn)

export default userRouter;