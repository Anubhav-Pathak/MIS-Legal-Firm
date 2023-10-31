import { Router } from "express";
import { generateOtp, verifyOtp, getFilter, postRead } from "../controllers/user.controller";
import isAuth from "../middlewares/isClient";

const userRouter: Router = Router();

userRouter.post("/read", isAuth, postRead);
userRouter.get("/filter", isAuth, getFilter);
userRouter.post("/generate-otp", generateOtp)
userRouter.post("/verify-otp", verifyOtp)

export default userRouter;