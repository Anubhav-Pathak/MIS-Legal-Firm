"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const admin_controller_1 = require("../controllers/admin.controller");
const isAdmin_1 = __importDefault(require("../middlewares/isAdmin"));
const isClient_1 = __importDefault(require("../middlewares/isClient"));
const multer_1 = __importDefault(require("../utils/multer"));
const router = (0, express_1.Router)();
router.post("/add-admin", isAdmin_1.default, admin_controller_1.postAddAdmin);
router.post("/add-client", isAdmin_1.default, multer_1.default.single('clientFile'), admin_controller_1.postAddClient);
router.get("/companies", isAdmin_1.default, admin_controller_1.getCompanies);
router.delete("/:clientId", isAdmin_1.default, admin_controller_1.deleteClient);
// router.patch("/:clientName",  isAdmin, editClient);
router.post("/update-file", isClient_1.default, multer_1.default.single('clientFile'), admin_controller_1.updateFile);
exports.default = router;
