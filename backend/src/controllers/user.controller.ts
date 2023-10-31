import { NextFunction, Request, Response } from "express";
import path from "path";
import fs from "fs";
import XLSX from "xlsx";

import {readExcelFile} from "../utils/s3";

const DEFAULT_LIMIT = 1;
const DEFAULT_PAGE = 1;

function searchInExcel(workbook: XLSX.WorkBook, search: string) {
  const results = [] as Record<string, number | string>[];

  for (const sheetName of workbook.SheetNames) {
    const worksheet = workbook.Sheets[sheetName];
    const data: Record<string, number | string>[] = XLSX.utils.sheet_to_json(worksheet);
    const searchResults = data.filter((row) => {
      return Object.values(row).some((value) => {
        return value.toString().toLowerCase().includes(search.toLowerCase());
      });
    });
    results.push(...searchResults);
  }
  return results;
}


export async function postRead(req: Request, res: Response, next: NextFunction) {
  try {
    const user = req.user;
    const { search, tab, filters } = req.body;

    if (!user) throw Error("User not found");

    const workbook = await readExcelFile("xlsx/"+user.company + ".xlsx");
    if (!workbook) throw Error("Error reading file");
    
    const tabs = workbook.SheetNames.map((tab: string) => tab.trim());
    const index = tabs.indexOf(tab ?? tabs[0]);

    const worksheet: XLSX.WorkSheet = workbook.Sheets[workbook.SheetNames[index]];
    if (!worksheet) throw { statusCode: 404, message: "Tab not found" };

    const page = req.query.page ? +req.query.page : DEFAULT_PAGE;
    const limit = req.body.limit ?? DEFAULT_LIMIT;

    const data: Record<string, number | string>[] = XLSX.utils.sheet_to_json(worksheet);
    const [headers] = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
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
        return filters.every((filter: any) => {
          return filter.value.includes(row[filter.label]);
        });
      });
      results = filterResults.slice(startIndex, endIndex);
      length = filterResults.length;
    }
    const remainingData = Math.max(length - endIndex, 0);
    const totalPages = Math.ceil(length / limit);
    res.status(200).send({headers, results, remainingData, totalPages, tabs: tabs });
  } catch (err: any) {
    if (!err.statusCode) err.statusCode = 500; 
    next(err);
  }
}

export async function getFilter(req: Request, res: Response): Promise<void> {
  try {
    const user = req.user;
    const tab = req.body.tab;
    const { filter } = req.query;
    const workbook = await readExcelFile("xlsx/"+user?.company + ".xlsx");
    if (!workbook) throw Error("Error reading file");
    if (!workbook) throw { status: 500, message: "Error reading file" };
    const worksheet: XLSX.WorkSheet = workbook.Sheets[tab ?? workbook.SheetNames[0]];
    if (!worksheet) throw { status: 404, message: "Company or tab not found" };
    const data: Record<string, number | string>[] = XLSX.utils.sheet_to_json(worksheet);
    const column = filter as string;
    const uniqueValues = [...new Set(data.map((row) => row[column]))].sort();
    res.status(200).send({ uniqueValues });
  } catch (e: any) {
    res.status(500).send({ message: e.message });
  }
}

export async function generateOTP(req: Request, res: Response): Promise<void> {}
export async function checkOTP(requ: Request, res: Response): Promise<boolean> {
  return true;
}

const getTemplates = (directoryPath: string, directories: string[]) => {
  try {
    const templates = [];

    for (const templateDirectory of directories) {
      const templateDirectoryPath = path.join(directoryPath, templateDirectory);
      const files = fs.readdirSync(templateDirectoryPath);

      const pdfFiles = files.filter((file) => path.extname(file) === ".pdf");

      for (const file of pdfFiles) {
        const filePath = path.join(templateDirectoryPath, file);
        const stats = fs.statSync(filePath);
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
  } catch (error) {
    console.error("Error reading directory:", error);
    return [];
  }
};