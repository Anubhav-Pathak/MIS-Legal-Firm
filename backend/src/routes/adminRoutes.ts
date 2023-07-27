import { Router } from "express";
import { postAddUser, deleteClient, editClient, getUsers } from "../controllers/admin.controller";
import isAdmin from "../middlewares/isAdmin";
import isAuth from "../middlewares/isAuth";

const router: Router = Router();

router.post("/add-user", postAddUser);
router.delete("/:clientName", isAuth, isAdmin, deleteClient); 
router.patch("/:clientName", isAuth, isAdmin, editClient);
router.get("/companies", isAuth, isAdmin, getUsers);

export default router;