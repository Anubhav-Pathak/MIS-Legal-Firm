import xlsx from 'xlsx';
import { Response, Request } from 'express';

export function read(req: Request, res: Response) {
    const filename = req.params.filename;
    const start: number = req.query.start ? parseInt(req.query.start as string) : 0;
    const end: number = req.query.end ? parseInt(req.query.end as string) : -1;
    const workbook: xlsx.WorkBook = xlsx.readFile(`./src/data/files/${filename}.xlsx`);
    const sheet_name_list: string[] = workbook.SheetNames;
    const data: any[] = xlsx.utils.sheet_to_json(workbook.Sheets[sheet_name_list[0]]);
    res.status(200).send(data.slice(start, end));
}