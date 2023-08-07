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
exports.uploadFile = exports.getFile = exports.getTemplates = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const pdfPath = `${process.cwd()}/src/data/pdf`;
function getTemplates(req, res) {
    try {
        const company = req.query.company;
        const templatesBasePath = path_1.default.join("src", "data", "templates");
        const templateFiles = fs_1.default.readdirSync(templatesBasePath);
        const pdfFiles = templateFiles.filter((file) => {
            const extension = path_1.default.extname(file);
            return extension === ".pdf";
        });
        if (pdfFiles.length === 0) {
            res.status(404).send({ message: "No templates found" });
            return;
        }
        res.setHeader("Content-Type", "application/pdf");
        res
            .status(200)
            .send({ message: `${pdfFiles.length} Templates found`, pdfFiles });
    }
    catch (e) {
        res.status(500).send({ message: e.message });
    }
}
exports.getTemplates = getTemplates;
function getFile(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { fileName } = req.params;
        const file = fs_1.default.readFileSync(path_1.default.join(pdfPath, fileName));
        if (file)
            return res.status(200).send({ message: "File read", file });
        else
            return res.status(400).send({ message: "File not read" });
    });
}
exports.getFile = getFile;
function uploadFile(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { file } = req.files;
        const { fileName } = req.body;
        const filePath = path_1.default.join(pdfPath, fileName);
        try {
            yield file.mv(filePath);
            return res.status(200).send({ message: "File uploaded" });
        }
        catch (e) {
            return res.status(400).send({ message: e.message });
        }
    });
}
exports.uploadFile = uploadFile;
/* weird experimental code
import { PDFDocument } from "pdf-lib";
const PDFJS = require("pdfjs-dist");

export async function createFile(req: any, res: any) {
  const { fileName, clients } = req.body;
  const filePath = path.join(pdfPath, fileName);
  const resultFilePath = path.join(pdfPath, "result.pdf");

  try {
    const content = fs.readFileSync(filePath);

    const loadingTask = PDFJS.getDocument(content);
    const pdf = await loadingTask.promise;

    const page = await pdf.getPage(1);

    const textContent = await page.getTextContent();
    const textItems = textContent.items.map((item) => item.str);

    const modifiedTextItems = textItems.map((item) =>
      item.replace("{{clients}}", clients.join(", "))
    );

    const modifiedContent = modifiedTextItems.join(" ");
    await page.setTextContent([{ str: modifiedContent }]);

    const modifiedContentBytes = await pdf.saveDocument();
    console.log({ modifiedContentBytes });

    fs.writeFileSync(resultFilePath, modifiedContentBytes);

    return res.status(200).send({ message: "File created" });
  } catch (error) {
    console.log({ error });
    return res.status(500).send({ error: "Failed to create file" });
  }
}
*/ 
