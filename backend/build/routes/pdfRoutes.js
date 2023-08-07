"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const pdf_controller_1 = require("../controllers/pdf.controller");
const router = (0, express_1.Router)();
router.get("/templates", pdf_controller_1.getTemplates);
router.get("/:filename", pdf_controller_1.getFile);
router.post("/upload", pdf_controller_1.uploadFile);
exports.default = router;
