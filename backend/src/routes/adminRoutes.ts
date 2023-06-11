import { Router } from "express";
import { postRead, upload, getfilterBy, postSearch } from "../controllers/xlsx";
import { verifyHeader, verifyAdminHeader } from "../middleware/headerVerification";

const router: Router = Router();

router.post("/read", verifyHeader, postRead);
router.put("/upload", verifyAdminHeader, upload);
router.get("/read/filter", verifyHeader, getfilterBy);
router.post("/read/filter", verifyHeader, postSearch);

export default router;