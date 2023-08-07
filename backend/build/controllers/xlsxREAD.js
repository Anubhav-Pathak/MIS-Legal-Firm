"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.read = void 0;
const xlsx_1 = __importDefault(require("xlsx"));
function read(req, res) {
    const company = req.params.company;
    const workbook = xlsx_1.default.readFile(`./src/data/files/data.xlsx`);
    if (!workbook.SheetNames.includes(company)) {
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
