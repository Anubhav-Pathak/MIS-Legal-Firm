import xlsx from 'xlsx';

export function read(filename:string) {
    const workbook: xlsx.WorkBook = xlsx.readFile(`./src/files/${filename}.xlsx`);
    const sheet_name_list: string[] = workbook.SheetNames;
    const data: any[] = xlsx.utils.sheet_to_json(workbook.Sheets[sheet_name_list[0]]);
    console.log(data);
    return data;

}