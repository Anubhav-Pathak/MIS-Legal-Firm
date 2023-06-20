import { Router } from "express";
import { createClient, deleteClient, editClient } from "../controllers/admin.controller";

const router: Router = Router();

router.post("/create", createClient);
router.delete("/:clientName", deleteClient); //should change to id
router.put("/:clientName", editClient); //should change to id

export default router;
