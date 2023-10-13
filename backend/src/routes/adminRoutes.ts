import { Router } from "express";
import { postAddClient, deleteClient, getCompanies, updateFile, postAddAdmin } from "../controllers/admin.controller";
import isAdmin from "../middlewares/isAdmin";
import isClient from "../middlewares/isClient";
import upload from "../utils/multer";

const router: Router = Router();

router.post("/add-admin", isAdmin, postAddAdmin);
router.post("/add-client", isAdmin, upload.single('clientFile'), postAddClient);
router.get("/companies", isAdmin, getCompanies);
router.delete("/:clientId", isAdmin, deleteClient); 
// router.patch("/:clientName",  isAdmin, editClient);
router.post("/update-file", isClient, updateFile);

export default router;