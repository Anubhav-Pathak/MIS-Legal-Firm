import { Router } from "express";
import { getFilter, postRead } from "../controllers/user.controller";
import { generateOtp, verifyOtp } from "../controllers/admin.controller";
import isAuth from "../middlewares/isClient";

const userRouter: Router = Router();

userRouter.post("/read", isAuth, postRead);
userRouter.get("/filter", isAuth, getFilter);
userRouter.get("/generate-otp", generateOtp)
userRouter.get("/verify-otp", verifyOtp)

export default userRouter;