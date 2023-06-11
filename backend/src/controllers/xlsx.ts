import XLSX from "xlsx";
import { Response, Request } from "express";
import path from "path";
import jwt from 'jsonwebtoken';

const worksheetPath = path.join("src", "data", "xlsx", "data.xlsx");
const DEFAULT_LIMIT = 15;
const DEFAULT_PAGE = 1;
const privateKey = process.env.JWT_SECRET || 'secret';

export function fetchCompany(req: Request): string {
	if (req.headers.token) {
		const token: string = req.headers.token.toString();
		const decoded: any = jwt.verify(token, privateKey);
		return decoded.company;
	} else {
		return "";
	}
}

export async function postRead(req: Request, res: Response): Promise<void> {
	try {
		const company: string = fetchCompany(req);
		const workbook: XLSX.WorkBook = XLSX.readFile(worksheetPath);
		if (!workbook) throw { status: 500, message: "Error reading file" };

		const worksheet: XLSX.WorkSheet = workbook.Sheets[company];
		if (!worksheet) throw { status: 404, message: "Company not found" };

		const page = req.query.page ? +req.query.page : DEFAULT_PAGE;
		let limit = req.query.limit ? +req.query.limit : DEFAULT_LIMIT;

		const data: Record<string, number | string>[] =
			XLSX.utils.sheet_to_json(worksheet);

		if (page > Math.ceil(data.length / limit))
			throw { status: 400, message: "Page must be less than total pages" };
		else if (limit > data.length)
			limit = data.length;

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

export async function upload(req: Request, res: Response) {
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

export async function getfilterBy(req: Request, res: Response): Promise<void> {
	try {
		const company: string = fetchCompany(req);
		const filters: any = req.query;
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

export async function postSearch(req: Request, res: Response): Promise<void> {
	try {
	const company = fetchCompany(req);
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
