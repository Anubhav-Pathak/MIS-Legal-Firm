import { Router } from "express";
import { postAddUser, deleteClient, editClient, getUsers } from "../controllers/admin.controller";
import isAdmin from "../middlewares/isAdmin";

const router: Router = Router();

router.post("/add-user", isAdmin, postAddUser);
router.delete("/:clientName", isAdmin, deleteClient); //should change to id
router.put("/:clientName", isAdmin, editClient); //should change to id

router.get("/companies", isAdmin, getUsers);

export default router;