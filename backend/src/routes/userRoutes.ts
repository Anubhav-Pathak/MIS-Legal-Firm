import { Router } from "express";
import { getCompanies, getfilterBy, postRead, postSearch, signIn, upload } from "../controllers/user.controller";

const userRouter: Router = Router();

userRouter.post("/sign-in", signIn)
userRouter.post("/read", postRead);
userRouter.put("/upload", upload);
userRouter.get("/read/filter", getfilterBy);
userRouter.post("/read/filter", postSearch);
userRouter.get("/companies", getCompanies);

export default userRouter;