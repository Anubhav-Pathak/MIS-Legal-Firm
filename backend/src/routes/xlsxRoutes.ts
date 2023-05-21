import { Router } from "express";
import { read } from "../controllers/xlsxREAD.js";
import { upload } from "../controllers/xlsxUPLOAD.js";

const router: Router = Router();

router.get("/read/:company", read);
router.post("/upload", upload);

export default router;