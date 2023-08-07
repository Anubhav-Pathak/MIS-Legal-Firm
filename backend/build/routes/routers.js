"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const xlsxREAD_js_1 = require("../controllers/xlsxREAD.js");
const router = (0, express_1.Router)();
router.get("/:filename", xlsxREAD_js_1.read);
exports.default = router;
