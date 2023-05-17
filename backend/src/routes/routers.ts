import { Router } from "express";
import { read } from "../utilities/xlsxREAD.js";

const router: Router = Router();

router.get("/:filename", (req: any, res: any) => {
    const filename: string = req.params.filename;
    const data: any = read(filename);
    res.status(200).send(data);
});

export default router;