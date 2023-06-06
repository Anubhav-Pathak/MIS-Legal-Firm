import XLSX from 'xlsx';
import { Response, Request } from 'express';
import path from 'path';

const worksheetPath = path.join("src", "data", "xlsx", "data.xlsx");

export function postRead(req: Request, res: Response) {
    try{
        const company: string = req.body.company;
        const workbook: XLSX.WorkBook = XLSX.readFile(worksheetPath);
        if (!workbook) throw { status: 500, message: 'Error reading file' };
        const worksheet: XLSX.WorkSheet = workbook.Sheets[company];
        if (!worksheet) throw { status: 404, message: 'Company not found' };
        const page: number = req.query.page ? +req.query.page : 1;
        const limit: number = req.body.limit ?? 15;
        const data: any[] = XLSX.utils.sheet_to_json(worksheet);

        if (page > Math.ceil(data.length/limit)) throw { status: 400, message: 'Page must be less than total pages' };
        else if (limit > data.length) throw { status: 400, message: 'Limit must be less than total data' };

        const results: any[] = data.slice((page-1)*limit, page*limit);
        
        res.status(200).send(results);
    }
    catch (e : any) {
        res.status(e.status).send({ message: e.message });
    }
}

export function upload(req: Request, res: Response) {
    if (!req.files) {
        return res.status(500).send({ message: 'No file uploaded' });
    } else {
        const file: any = req.files.file;
        file.mv(`/xlsx/data.xlsx`, (err: any) => {
            if (err) {
                console.log(err);
                return res.status(500).send({ message: 'Error uploading file' });
            }
        });
        res.status(200).send({ message: 'Uploaded file' });
    }
}