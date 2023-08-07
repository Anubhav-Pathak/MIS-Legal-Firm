"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.upload = exports.read = void 0;
const xlsx_1 = __importDefault(require("xlsx"));
const path_1 = __importDefault(require("path"));
const worksheetPath = path_1.default.join("src", "data", "xlsx", "data.xlsx");
function read(req, res) {
    const company = req.params.company;
    const workbook = xlsx_1.default.readFile(worksheetPath);
    console.log(workbook.SheetNames);
    if (!workbook) {
        return res.status(404).send({ message: 'Company not found' });
    }
    const worksheet = workbook.Sheets[company];
    const page = req.query.page ? parseInt(req.query.page) : 1;
    const limit = req.query.limit ? parseInt(req.query.limit) : 15;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const data = xlsx_1.default.utils.sheet_to_json(worksheet);
    const results = data.slice(startIndex, endIndex);
    res.status(200).send({
        data: results,
        total: data.length,
        totalPages: Math.ceil(data.length / limit)
    });
}
exports.read = read;
function upload(req, res) {
    if (!req.files) {
        return res.status(500).send({ message: 'No file uploaded' });
    }
    else {
        const file = req.files.file;
        file.mv(`/xlsx/data.xlsx`, (err) => {
            if (err) {
                console.log(err);
                return res.status(500).send({ message: 'Error uploading file' });
            }
        });
        res.status(200).send({ message: 'Uploaded file' });
    }
}
exports.upload = upload;
