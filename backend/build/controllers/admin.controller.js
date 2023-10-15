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
exports.updateFile = exports.deleteClient = exports.getCompanies = exports.postAddClient = exports.postAddAdmin = void 0;
const argon2 = __importStar(require("argon2"));
const Client_1 = __importDefault(require("../models/Client"));
const Admin_1 = __importDefault(require("../models/Admin"));
const s3_1 = require("../utils/s3");
const postAddAdmin = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { company, username, password } = req.body;
    try {
        let hashedPassword = yield argon2.hash(password);
        const user = yield Admin_1.default.create({ company, username, password: hashedPassword, companies: [] });
        if (!user)
            throw Error('Admin not created');
        res.status(200).send({ message: "Admin added successfully" });
    }
    catch (err) {
        if (!err.statusCode)
            err.statusCode = 500;
        next(err);
    }
});
exports.postAddAdmin = postAddAdmin;
const postAddClient = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    let { company, username, password } = req.body;
    try {
        company = company.replace(/\s/g, "-").toLowerCase();
        const clientFileName = `${company}.xlsx`;
        const data = yield (0, s3_1.uploadFile)('xlsx', clientFileName, req.file);
        if (!data)
            throw Error('File not uploaded');
        let hashedPassword = yield argon2.hash(password);
        const user = yield Client_1.default.create({ company, username, password: hashedPassword, clientFile: clientFileName, pdfTemplates: [], createdBy: req.user._id });
        if (!user)
            throw Error('User not created');
        const admin = yield Admin_1.default.findById(req.user._id);
        admin.companies.push(user._id);
        yield admin.save();
        res.status(200).send({ message: "User added successfully" });
    }
    catch (err) {
        if (!err.statusCode)
            err.statusCode = 500;
        next(err);
    }
});
exports.postAddClient = postAddClient;
const getCompanies = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const clients = [];
        const user = req.user;
        const admin = yield Admin_1.default.findById(user._id).populate('companies');
        if (!admin)
            throw ({ statusCode: 404, message: "No companies found" });
        admin.companies.forEach((client) => {
            (0, s3_1.readMetaData)('xlsx/' + client.clientFile).then((data) => {
                const fileSizeInKB = data.ContentLength / 1024;
                const fileUpdatedOn = data.LastModified;
                const updatedClient = Object.assign(Object.assign({}, client._doc), { fileSizeInKB, fileUpdatedOn });
                clients.push(updatedClient);
                if (clients.length === admin.companies.length) {
                    res.status(200).send({ clients });
                }
            });
        });
    }
    catch (err) {
        if (!err.statusCode)
            err.statusCode = 500;
        next(err);
    }
});
exports.getCompanies = getCompanies;
const deleteClient = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let clientId = req.params.clientId;
    const client = yield Client_1.default.findById(clientId);
    try {
        yield Client_1.default.findByIdAndDelete(clientId);
        (0, s3_1.deleteFile)('xlsx/' + client.clientFile);
        const admin = yield Admin_1.default.findById(req.user._id);
        const updatedCompanies = admin.companies.filter((company) => company.toString() !== clientId);
        admin.companies = updatedCompanies;
        yield admin.save();
        res.status(200).send({ message: "Client deleted successfully" });
    }
    catch (error) {
        if (!error.statusCode)
            error.statusCode = 500;
        res.status(error.statusCode).send({ error: error.message });
    }
});
exports.deleteClient = deleteClient;
const updateFile = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    try {
        if (req.file) {
            const clientFileName = `${user.company}.xlsx`;
            const data = yield (0, s3_1.uploadFile)('xlsx', clientFileName, req.file);
            if (!data)
                throw Error('File not uploaded');
            res.status(200).send({ message: "File updated successfully" });
        }
    }
    catch (err) {
        console.error("Error:", err);
        if (!err.statusCode)
            err.statusCode = 500;
        next(err);
    }
});
exports.updateFile = updateFile;
