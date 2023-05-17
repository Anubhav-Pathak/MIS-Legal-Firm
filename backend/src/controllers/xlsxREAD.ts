import xlsx from 'xlsx';
import { Response, Request } from 'express';

export function read(req: Request, res: Response) {
    const filename = req.params.filename;
    const workbook: xlsx.WorkBook = xlsx.readFile(`./src/files/${filename}.xlsx`);
    const sheet_name_list: string[] = workbook.SheetNames;
    const data: any[] = xlsx.utils.sheet_to_json(workbook.Sheets[sheet_name_list[0]]);
    res.send(data);
}