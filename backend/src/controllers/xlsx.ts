import XLSX from "xlsx";
import { Response, Request } from "express";
import path from "path";

const worksheetPath = path.join("src", "data", "xlsx", "data.xlsx");
const DEFAULT_LIMIT = 15;
const DEFAULT_PAGE = 1;

export function postRead(req: Request, res: Response): void {
  try {
    const company = req.body.company;
    const workbook: XLSX.WorkBook = XLSX.readFile(worksheetPath);
    if (!workbook) throw { status: 500, message: "Error reading file" };

    const worksheet: XLSX.WorkSheet = workbook.Sheets[company];
    if (!worksheet) throw { status: 404, message: "Company not found" };

    const page = req.query.page ? +req.query.page : DEFAULT_PAGE;
    const limit = req.body.limit ?? DEFAULT_LIMIT;

    const data: Record<string, number | string>[] =
      XLSX.utils.sheet_to_json(worksheet);

    if (page > Math.ceil(data.length / limit))
      throw { status: 400, message: "Page must be less than total pages" };
    else if (limit > data.length)
      throw { status: 400, message: "Limit must be less than total data" };

    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const results: Record<string, number | string>[] = data.slice(
      startIndex,
      endIndex
    );

    const remainingData = Math.max(data.length - endIndex, 0);
    const totalPages = Math.ceil(data.length / limit);

    res.status(200).send({ results, remainingData, totalPages });
  } catch (e: any) {
    res.status(500).send({ message: e.message });
  }
}

export function upload(req: Request, res: Response) {
  if (!req.files) {
    return res.status(500).send({ message: "No file uploaded" });
  } else {
    const file: any = req.files.file;
    file.mv(`/xlsx/data.xlsx`, (err: any) => {
      if (err) {
        console.log(err);
        return res.status(500).send({ message: "Error uploading file" });
      }
    });
    res.status(200).send({ message: "Uploaded file" });
  }
}

export function getfilterBy(req: Request, res: Response): void {
  try {
    const company = "SME ";
    const filters: Record<string, string | string[]> = req.query;
    const page: number = req.query.page ? +req.query.page : DEFAULT_PAGE;
    const limit: number = req.query.limit ? +req.query.limit : DEFAULT_LIMIT;

    const workbook: XLSX.WorkBook = XLSX.readFile(worksheetPath);
    if (!workbook) throw { status: 500, message: "Error reading file" };

    const worksheet: XLSX.WorkSheet = workbook.Sheets[company];
    if (!worksheet) throw { status: 404, message: "Company not found" };

    const data: Record<string, number | string>[] =
      XLSX.utils.sheet_to_json(worksheet);

    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const filteredResults: Record<string, number | string>[] = data.filter(
      (row) => {
        // todo: handle empty filters
        let valid = true;
        for (const key in filters) {
          if (filters[key] !== row[key]) {
            valid = false;
            break;
          }
        }
        return valid;
      }
    );

    const results = filteredResults.slice(startIndex, endIndex);
    const remainingData = Math.max(results.length - endIndex, 0);
    const totalPages = Math.ceil(results.length / limit);

    res.status(200).send({ results, remainingData, totalPages });
  } catch (e: any) {
    res.status(500).send({ message: e.message });
  }
}

export function postSearch(req: Request, res: Response): void {
  try {
    const company = "SME ";
    const search = req.body.search;
    const page: number = req.body.page ? +req.body.page : DEFAULT_PAGE;
    const limit: number = req.body.limit ? +req.body.limit : DEFAULT_LIMIT;

    const workbook: XLSX.WorkBook = XLSX.readFile(worksheetPath);
    if (!workbook) throw { status: 500, message: "Error reading file" };

    const worksheet: XLSX.WorkSheet = workbook.Sheets[company];
    if (!worksheet) throw { status: 404, message: "Company not found" };

    const data: Record<string, number | string>[] =
      XLSX.utils.sheet_to_json(worksheet);

    const filteredResults: Record<string, number | string>[] = data.filter(
      (row) => {
        let valid = false;
        for (const key in row) {
          if (
            row[key].toString().toLowerCase().includes(search.toLowerCase())
          ) {
            valid = true;
            break;
          }
        }
        return valid;
      }
    );

    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const results = filteredResults.slice(startIndex, endIndex);
    const remainingData = Math.max(filteredResults.length - endIndex, 0);
    const totalPages = Math.ceil(filteredResults.length / limit);

    res.status(200).send({ results, remainingData, totalPages });
  } catch (e: any) {
    res.status(500).send({ message: e.message });
  }
}
