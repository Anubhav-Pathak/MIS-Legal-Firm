import { Router } from "express";
import { postRead, upload, getfilterBy, postSearch, getCompanies } from "../controllers/xlsx";

const router: Router = Router();

router.post("/read", postRead);
router.put("/upload", upload);
router.get("/read/filter", getfilterBy);
router.post("/read/filter", postSearch);
router.get("/companies", getCompanies)

export default router;