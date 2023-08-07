"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const xlsx_js_1 = require("../controllers/xlsx.js");
const router = (0, express_1.Router)();
router.get("/read/", xlsx_js_1.read);
router.post("/upload", xlsx_js_1.upload);
exports.default = router;
