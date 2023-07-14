import { Router } from "express";
import { postAddUser, deleteClient, editClient, getUsers } from "../controllers/admin.controller";

const router: Router = Router();

router.post("/add-user", postAddUser);
router.delete("/:clientName", deleteClient); //should change to id
router.put("/:clientName", editClient); //should change to id

router.get("/companies", getUsers);

export default router;