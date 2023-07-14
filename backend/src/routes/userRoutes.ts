import { Router } from "express";
import { getfilterBy, postRead, postSearch, signIn, upload } from "../controllers/user.controller";
import isAuth from "../middlewares/isAuth";

const userRouter: Router = Router();

userRouter.post("/sign-in", signIn)
userRouter.post("/read", isAuth, postRead);
userRouter.put("/upload", upload);
userRouter.get("/read/filter", getfilterBy);
userRouter.post("/read/filter", postSearch);

export default userRouter;