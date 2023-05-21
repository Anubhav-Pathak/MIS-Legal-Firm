import { Response, Request } from 'express';

export function upload(req: Request, res: Response) {
    if (!req.files) {
        return res.status(500).send({ message: 'No file uploaded' });
    } else {
        const file: any = req.files.file;
        file.mv(`./src/data/files/data.xlsx`, (err: any) => {
            if (err) {
                console.log(err);
                return res.status(500).send({ message: 'Error uploading file' });
            }
        });
        res.status(200).send({ message: 'Uploaded file' });
    }
}