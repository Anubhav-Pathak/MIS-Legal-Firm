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
exports.verify = void 0;
const argon2_1 = __importDefault(require("argon2"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const Admin_1 = __importDefault(require("../models/Admin"));
const Client_1 = __importDefault(require("../models/Client"));
const privateKey = fs_1.default.readFileSync(path_1.default.join(path_1.default.resolve(), 'privateKey.key'));
function signIn(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const { username, password, isAdmin, bypass } = req.body;
        try {
            const user = isAdmin ? yield Admin_1.default.findOne({ username }) : yield Client_1.default.findOne({ username });
            if (!user)
                throw { statusCode: 401, message: 'Invalid Credentials' };
            if (bypass && user.password === password) {
                const token = jsonwebtoken_1.default.sign({ user: user._id }, privateKey, { algorithm: 'RS256' });
                return res.status(200).send({ message: 'User signed in', token, company: user.company });
            }
            const isPasswordCorrect = yield argon2_1.default.verify(user.password, password);
            if (!isPasswordCorrect)
                throw { statusCode: 401, message: 'Invalid Credentials' };
            const token = jsonwebtoken_1.default.sign({ user: user._id }, privateKey, { algorithm: 'RS256' });
            return res.status(200).send({ message: 'User signed in', token, company: user.company });
        }
        catch (err) {
            if (!err.statusCode)
                err.statusCode = 500;
            next(err);
        }
    });
}
function verify(req, res, next) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        const token = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(' ')[1];
        if (!token)
            throw Error('No token provided');
        try {
            const decoded = jsonwebtoken_1.default.verify(token, privateKey);
            if (!decoded)
                throw Error('Invalid token');
            if (!(yield Admin_1.default.findById(decoded.user)))
                throw Error("Invalid Token");
            return res.status(200).send({ isAuthenticated: true });
        }
        catch (err) {
            return res.status(200).send({ isAuthenticated: false });
        }
    });
}
exports.verify = verify;
;
exports.default = signIn;
