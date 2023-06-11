import { Router } from "express";
import { signIn, signUp } from "../controllers/user.controller";
import { verifyAdminHeader } from "../middleware/headerVerification";

const userRouter: Router = Router();

userRouter.post("/add-user", verifyAdminHeader, signUp);
userRouter.post("/sign-in", signIn)

export default userRouter;