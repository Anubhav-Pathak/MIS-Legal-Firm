import { Router } from "express";
import { postAddUser, deleteClient, editClient, getUsers } from "../controllers/admin.controller";
import isAdmin from "../middlewares/isAdmin";
import isAuth from "../middlewares/isAuth";

const router: Router = Router();

router.post("/add-user", isAuth, isAdmin, postAddUser);
router.delete("/:clientName", isAuth, isAdmin, deleteClient); //should change to id
router.put("/:clientName", isAuth, isAdmin, editClient); //should change to id

router.get("/companies", isAuth, isAdmin, getUsers);

export default router;