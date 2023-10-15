"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
const mongoose_1 = __importDefault(require("mongoose"));
const path_1 = __importDefault(require("path"));
const userRoutes_1 = __importDefault(require("./routes/userRoutes"));
const pdfRoutes_1 = __importDefault(require("./routes/pdfRoutes"));
const adminRoutes_1 = __importDefault(require("./routes/adminRoutes"));
const auth_controller_1 = __importStar(require("./controllers/auth.controller"));
const app = (0, express_1.default)();
dotenv_1.default.config();
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/lawfirm";
const PORT = process.env.PORT || 5000;
dotenv_1.default.config();
app.use((0, cors_1.default)());
app.set("view engine", "pug");
app.set("views", "src/views");
app.use(express_1.default.json());
app.use(body_parser_1.default.urlencoded({ extended: false }));
app.use(express_1.default.static(path_1.default.join(path_1.default.resolve(), "data")));
app.use(express_1.default.static(path_1.default.join(path_1.default.resolve(), "public")));
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
});
app.post("/api/sign-in", auth_controller_1.default);
app.post("/api/verify", auth_controller_1.verify);
app.use("/api", userRoutes_1.default);
app.use("/api/pdf", pdfRoutes_1.default);
app.use("/api/admin", adminRoutes_1.default);
app.use((error, req, res, next) => {
    console.log(error);
    const status = error.statusCode || 500;
    const message = error.message;
    const data = error.data;
    return res.status(status).json({ message: message, data: data });
});
mongoose_1.default.set("strictQuery", false);
mongoose_1.default
    .connect(MONGODB_URI)
    .then(() => {
    console.log("Connected to Database");
})
    .then(() => {
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
})
    .catch((e) => console.log(e));
