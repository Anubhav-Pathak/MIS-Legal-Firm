import { Router } from "express";
import { postRead, upload, getfilterBy, postSearch } from "../controllers/xlsx";

const router: Router = Router();

router.post("/read", postRead);
router.put("/upload", upload);
router.get("/filter", getfilterBy);
router.post("/filter", postSearch);

export default router;