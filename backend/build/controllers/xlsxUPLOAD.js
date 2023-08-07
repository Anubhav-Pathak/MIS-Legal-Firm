"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.upload = void 0;
function upload(req, res) {
    if (!req.files) {
        return res.status(500).send({ message: 'No file uploaded' });
    }
    else {
        const file = req.files.file;
        file.mv(`./src/data/files/data.xlsx`, (err) => {
            if (err) {
                console.log(err);
                return res.status(500).send({ message: 'Error uploading file' });
            }
        });
        res.status(200).send({ message: 'Uploaded file' });
    }
}
exports.upload = upload;
