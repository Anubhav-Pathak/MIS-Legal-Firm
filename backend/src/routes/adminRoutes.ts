import { Router } from "express";
import { postRead, upload } from "../controllers/xlsx";

const router: Router = Router();

router.post("/read", postRead);
router.put("/upload", upload);

export default router;