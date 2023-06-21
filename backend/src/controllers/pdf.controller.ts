import { Response, Request } from "express";
import fs from "fs";
import path from "path";

const pdfPath = `${process.cwd()}/src/data/pdf`;

export function getTemplates(req: Request, res: Response): void {
  try {
    const company = req.query.company as string;

    const templatesBasePath = path.join("src", "data", "templates");
    const templateFiles = fs.readdirSync(templatesBasePath);

    const pdfFiles: string[] = templateFiles.filter((file) => {
      const extension = path.extname(file);
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
  } catch (e: any) {
    res.status(500).send({ message: e.message });
  }
}

export async function getFile(req: any, res: any) {
  const { fileName } = req.params;
  const file = fs.readFileSync(path.join(pdfPath, fileName));
  if (file) return res.status(200).send({ message: "File read", file });
  else return res.status(400).send({ message: "File not read" });
}

export async function uploadFile(req: any, res: any) {
  const { file } = req.files;
  const { fileName } = req.body;
  const filePath = path.join(pdfPath, fileName);
  try {
    await file.mv(filePath);
    return res.status(200).send({ message: "File uploaded" });
  } catch (e: any) {
    return res.status(400).send({ message: e.message });
  }
}

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