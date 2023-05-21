import xlsx from 'xlsx';
import { Response, Request } from 'express';

export function read(req: Request, res: Response) {
    const company: string = req.params.company;
    const workbook: xlsx.WorkBook = xlsx.readFile(`./src/data/files/data.xlsx`);
    const worksheet: xlsx.WorkSheet = workbook.Sheets[company];
    const data: any[] = xlsx.utils.sheet_to_json(worksheet, { raw: true });
    const page: number = req.query.page ? parseInt(req.query.page as string) : 0;
    const limit: number = req.query.limit ? parseInt(req.query.limit as string) : 15;
    const startIndex: number = (page - 1) * limit;
    const endIndex: number = page * limit;
    const results: any[] = data.slice(startIndex, endIndex);
    res.status(200).send({ 
        data: results, 
        total: data.length, 
        totalPages: Math.ceil(data.length / limit) 
    });
}