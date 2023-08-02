import { Router } from "express";
import { postAddClient, deleteClient, getCompanies, updateFile, postAddAdmin } from "../controllers/admin.controller";
import isAdmin from "../middlewares/isAdmin";

const router: Router = Router();

router.post("/add-admin",isAdmin, postAddAdmin);
router.post("/add-client", isAdmin, postAddClient);
router.get("/companies", isAdmin, getCompanies);
router.delete("/:clientId", isAdmin, deleteClient); 
// router.patch("/:clientName",  isAdmin, editClient);
router.post("/update-file",isAdmin, updateFile);


export default router;