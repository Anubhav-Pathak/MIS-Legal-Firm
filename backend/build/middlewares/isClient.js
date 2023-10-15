"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const Client_1 = __importDefault(require("../models/Client"));
const privateKey = fs_1.default.readFileSync(path_1.default.join(path_1.default.resolve(), 'privateKey.key'));
const isAuth = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const authHeader = req.get("Authorization");
        if (!authHeader)
            throw { statusCode: 401, message: "Not authenticated!" };
        const token = authHeader.split(" ")[1];
        const decodedToken = jsonwebtoken_1.default.verify(token, privateKey, { algorithms: ['RS256'] });
        if (!decodedToken)
            throw { statusCode: 401, message: "Not authenticated!" };
        const result = yield Client_1.default.findById(decodedToken.user);
        if (!result)
            throw { statusCode: 401, message: "Not authenticated!" };
        req.user = result;
        next();
    }
    catch (err) {
        if (!err.statusCode)
            err.statusCode = 500;
        next(err);
    }
});
exports.default = isAuth;
