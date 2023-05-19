import { Router } from "express";
import { read } from "../controllers/xlsxREAD.js";

const router: Router = Router();

router.get("/:filename", read);

export default router;