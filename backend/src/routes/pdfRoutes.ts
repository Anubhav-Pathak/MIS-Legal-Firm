import { Router } from "express";
import { getTemplates, getFile, uploadFile } from "../controllers/pdf.controller";

const router: Router = Router();

router.get("/templates", getTemplates);
router.get("/:filename", getFile);
router.post("/upload", uploadFile);

export default router;