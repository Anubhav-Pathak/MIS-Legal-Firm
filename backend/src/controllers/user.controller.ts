import * as argon2 from "argon2";
import { NextFunction, Request, Response } from "express";
import jwt from 'jsonwebtoken'
import path from "path";
import fs from "fs";
import XLSX from "xlsx";

import User from "../models/User";

const privateKey = process.env.JWT_SECRET || 'secret';

export async function signIn(req: Request, res: Response) {
    const { username, password }: {
        username: string,
        password: string,
    } = req.body;
    try {
        const user = await User.findOne({ username });
        if (user) {
            const isPasswordCorrect = await argon2.verify(user.password, password);
            if (isPasswordCorrect){
                const token = jwt.sign({ username: user.username }, privateKey, { algorithm: 'RS256' });
                return res.status(200).send({ message: 'User signed in', token });
            }
            else return res.status(400).send({ message: 'User not signed in' });
        }
        else return res.status(400).send({ message: 'User not signed in' });
    } catch (e: any) {
        return res.status(400).send({ message: e.message });
    }
}

const worksheetPath = path.join("src", "data", "xlsx", "data.xlsx");
const DEFAULT_LIMIT = 15;
const DEFAULT_PAGE = 1;

export function postRead(req: Request, res: Response): void {
  try {
    const { company, tab } = req.body;
    const worksheetPath = path.join("src", "data", "xlsx", company + ".xlsx");
    const workbook: XLSX.WorkBook = XLSX.readFile(worksheetPath);
    if (!workbook) throw { status: 500, message: "Error reading file" };

    const worksheet: XLSX.WorkSheet =
      workbook.Sheets[tab || workbook.SheetNames[0]];
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

    res
      .status(200)
      .send({ results, remainingData, totalPages, tabs: workbook.SheetNames });
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
    const filters: Record<string, string | string[]> = req.query;
    const page: number = req.query.page ? +req.query.page : DEFAULT_PAGE;
    const limit: number = req.query.limit ? +req.query.limit : DEFAULT_LIMIT;
    const company: string = req.query.company;
    const tab: string = req.query.tab;

    const worksheetPath = path.join("src", "data", "xlsx", company, company + ".xlsx");

    const workbook: XLSX.WorkBook = XLSX.readFile(worksheetPath);
    if (!workbook) throw { status: 500, message: "Error reading file" };

    const worksheet: XLSX.WorkSheet =
      workbook.Sheets[tab || workbook.SheetNames[0]];
    if (!worksheet) throw { status: 404, message: "Company or tab not found" };

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
    const { company, tab, search } = req.body;
    const page: number = req.body.page ? +req.body.page : DEFAULT_PAGE;
    const limit: number = req.body.limit ? +req.body.limit : DEFAULT_LIMIT;

    const worksheetPath = path.join("src", "data", "xlsx", company, company + ".xlsx");

    const workbook: XLSX.WorkBook = XLSX.readFile(worksheetPath);
    if (!workbook) throw { status: 500, message: "Error reading file" };

    const worksheet: XLSX.WorkSheet =
      workbook.Sheets[tab || workbook.SheetNames[0]];
    if (!worksheet) throw { status: 404, message: "Company or tab not found" };

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

export const getCompanies = (req: Request, res: Response) => {
  const xlsxDirectoryPath = path.join("src", "data", "xlsx");
  const templatesDirectoryPath = path.join("src", "data", "templates");

  try {
    const xlsxDirectories = fs.readdirSync(xlsxDirectoryPath);

    const templatesDirectories = fs.readdirSync(templatesDirectoryPath);

    const companies = [];

    for (const xlsxDirectory of xlsxDirectories) {
      const xlsxDirectoryFullPath = path.join(xlsxDirectoryPath, xlsxDirectory);
      const files = fs.readdirSync(xlsxDirectoryFullPath);

      const xlsxFiles = files.filter((file) => path.extname(file) === ".xlsx");

      for (const file of xlsxFiles) {
        const filePath = path.join(xlsxDirectoryFullPath, file);
        const stats = fs.statSync(filePath);
        const sizeInBytes = stats.size;
        const createdAt = stats.birthtime;

        const workbook: XLSX.WorkBook = XLSX.readFile(filePath);
        const tabs = workbook.SheetNames;

        companies.push({
          name: file,
          sizeInBytes,
          createdAt,
          tabs,
          templates: getTemplates(templatesDirectoryPath, templatesDirectories),
        });
      }
    }

    res.status(200).send({ companies });
  } catch (error) {
    console.error("Error reading directory:", error);
    res.status(500).send({ message: "Error reading directory" });
  }
};

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