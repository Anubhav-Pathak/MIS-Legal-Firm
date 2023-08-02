import { Router } from "express";
import { getfilterBy, postRead, postSearch, upload } from "../controllers/user.controller";
import isAuth from "../middlewares/isClient";

const userRouter: Router = Router();

userRouter.post("/read", isAuth, postRead);
userRouter.put("/upload", isAuth, upload);
userRouter.get("/read/filter", isAuth, getfilterBy);
userRouter.post("/read/filter", isAuth, postSearch);

export default userRouter;