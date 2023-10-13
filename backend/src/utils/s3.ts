import AWS from 'aws-sdk';
import dotenv from 'dotenv';
import XLSX from 'xlsx';

dotenv.config();

AWS.config.update({
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_KEY
});

const s3 = new AWS.S3({});
const bucketName = process.env.AWS_BUCKET_NAME as string;

export const uploadFile = async (folder: string, fileName: string, file: any): Promise<any> => {
    const params: AWS.S3.PutObjectRequest = {
        Bucket: bucketName,
        Key: `${folder}/`+fileName,
        Body: file.buffer,
        ContentType: file.mimetype,
    };
    return new Promise((resolve, reject) => {
        s3.upload(params, function (err, data) {
            if (err) {
                reject(err);
            } else {
                resolve(data);
            }
        });
    });
};

export const readMetaData = async (fileName: string): Promise<any> => {
    const params = {
        Bucket: bucketName,
        Key: fileName,
    };
    return new Promise((resolve, reject) => {
        s3.headObject(params, function (err, data) {
            if (err) {
                reject(err);
            } else {
                resolve(data);
            }
        });
    });
};

export const deleteFile = async (fileName: string): Promise<any> => {
    const params = {
        Bucket: bucketName,
        Key: fileName,
    };
    return new Promise((resolve, reject) => {
        s3.deleteObject(params, function (err, data) {
            if (err) {
                reject(err);
            } else {
                resolve(data);
            }
        });
    });
};

export const readExcelFile = async (fileName: string): Promise<any> => {
    const params: any = {
        Bucket: bucketName,
        Key: fileName,
    };
    const file = s3.getObject(params).createReadStream();

    return new Promise((resolve, reject) => {
        const buffers: any = [];

        file.on('data', function (data) {
            buffers.push(data);
        });
  
        file.on('end', function () {
            const buffer = Buffer.concat(buffers);
            const workbook = XLSX.read(buffer, { type: 'buffer' });
            const workSheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[workSheetName];
            const data = XLSX.utils.sheet_to_json(worksheet, { defval: ''});
            resolve(data);
        });
    
        file.on('error', (err) => {
            reject(err);
        });
    });
};