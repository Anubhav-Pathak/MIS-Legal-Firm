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
exports.getFilter = exports.postRead = void 0;
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const xlsx_1 = __importDefault(require("xlsx"));
const s3_1 = require("../utils/s3");
const DEFAULT_LIMIT = 1;
const DEFAULT_PAGE = 1;
function searchInExcel(workbook, search) {
    const results = [];
    for (const sheetName of workbook.SheetNames) {
        const worksheet = workbook.Sheets[sheetName];
        const data = xlsx_1.default.utils.sheet_to_json(worksheet);
        const searchResults = data.filter((row) => {
            return Object.values(row).some((value) => {
                return value.toString().toLowerCase().includes(search.toLowerCase());
            });
        });
        results.push(...searchResults);
    }
    return results;
}
function postRead(req, res, next) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const user = req.user;
            const { search, tab, filters } = req.body;
            if (!user)
                throw Error("User not found");
            const workbook = yield (0, s3_1.readExcelFile)("xlsx/" + user.company + ".xlsx");
            if (!workbook)
                throw Error("Error reading file");
            const tabs = workbook.SheetNames.map((tab) => tab.trim());
            const index = tabs.indexOf(tab !== null && tab !== void 0 ? tab : tabs[0]);
            const worksheet = workbook.Sheets[workbook.SheetNames[index]];
            if (!worksheet)
                throw { statusCode: 404, message: "Tab not found" };
            const page = req.query.page ? +req.query.page : DEFAULT_PAGE;
            const limit = (_a = req.body.limit) !== null && _a !== void 0 ? _a : DEFAULT_LIMIT;
            const data = xlsx_1.default.utils.sheet_to_json(worksheet);
            const [headers] = xlsx_1.default.utils.sheet_to_json(worksheet, { header: 1 });
            let length = data.length;
            const startIndex = (page - 1) * limit;
            const endIndex = page * limit;
            let results = data.slice(startIndex, endIndex);
            if (search) {
                const searchResults = searchInExcel(workbook, search);
                results = searchResults.slice(startIndex, endIndex);
                length = searchResults.length;
            }
            if (filters.length > 0) {
                const filterResults = data.filter((row) => {
                    return filters.every((filter) => {
                        return filter.value.includes(row[filter.label]);
                    });
                });
                results = filterResults.slice(startIndex, endIndex);
                length = filterResults.length;
            }
            const remainingData = Math.max(length - endIndex, 0);
            const totalPages = Math.ceil(length / limit);
            res.status(200).send({ headers, results, remainingData, totalPages, tabs: tabs });
        }
        catch (err) {
            if (!err.statusCode)
                err.statusCode = 500;
            next(err);
        }
    });
}
exports.postRead = postRead;
function getFilter(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const user = req.user;
            const tab = req.body.tab;
            const { filter } = req.query;
            const workbook = yield (0, s3_1.readExcelFile)("xlsx/" + (user === null || user === void 0 ? void 0 : user.company) + ".xlsx");
            if (!workbook)
                throw Error("Error reading file");
            if (!workbook)
                throw { status: 500, message: "Error reading file" };
            const worksheet = workbook.Sheets[tab !== null && tab !== void 0 ? tab : workbook.SheetNames[0]];
            if (!worksheet)
                throw { status: 404, message: "Company or tab not found" };
            const data = xlsx_1.default.utils.sheet_to_json(worksheet);
            const column = filter;
            const uniqueValues = [...new Set(data.map((row) => row[column]))].sort();
            res.status(200).send({ uniqueValues });
        }
        catch (e) {
            res.status(500).send({ message: e.message });
        }
    });
}
exports.getFilter = getFilter;
const getTemplates = (directoryPath, directories) => {
    try {
        const templates = [];
        for (const templateDirectory of directories) {
            const templateDirectoryPath = path_1.default.join(directoryPath, templateDirectory);
            const files = fs_1.default.readdirSync(templateDirectoryPath);
            const pdfFiles = files.filter((file) => path_1.default.extname(file) === ".pdf");
            for (const file of pdfFiles) {
                const filePath = path_1.default.join(templateDirectoryPath, file);
                const stats = fs_1.default.statSync(filePath);
                const sizeInBytes = stats.size;
                const createdAt = stats.birthtime;
                templates.push({
                    name: file,
                    sizeInBytes,
                    createdAt,
                });
            }
        }
        return templates;
    }
    catch (error) {
        console.error("Error reading directory:", error);
        return [];
    }
};
