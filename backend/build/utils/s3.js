"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.readExcelFile = exports.deleteFile = exports.readMetaData = exports.uploadFile = void 0;
const aws_sdk_1 = __importDefault(require("aws-sdk"));
const dotenv_1 = __importDefault(require("dotenv"));
const xlsx_1 = __importDefault(require("xlsx"));
dotenv_1.default.config();
aws_sdk_1.default.config.update({
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_KEY
});
const s3 = new aws_sdk_1.default.S3({});
const bucketName = process.env.AWS_BUCKET_NAME;
const uploadFile = (folder, fileName, file) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(fileName);
    const params = {
        Bucket: bucketName,
        Key: `${folder}/` + fileName,
        Body: file.buffer,
        ContentType: file.mimetype,
    };
    return new Promise((resolve, reject) => {
        s3.upload(params, function (err, data) {
            if (err) {
                reject(err);
            }
            else {
                resolve(data);
            }
        });
    });
});
exports.uploadFile = uploadFile;
const readMetaData = (fileName) => __awaiter(void 0, void 0, void 0, function* () {
    const params = {
        Bucket: bucketName,
        Key: fileName,
    };
    return new Promise((resolve, reject) => {
        s3.headObject(params, function (err, data) {
            if (err) {
                reject(err);
            }
            else {
                resolve(data);
            }
        });
    });
});
exports.readMetaData = readMetaData;
const deleteFile = (fileName) => __awaiter(void 0, void 0, void 0, function* () {
    const params = {
        Bucket: bucketName,
        Key: fileName,
    };
    return new Promise((resolve, reject) => {
        s3.deleteObject(params, function (err, data) {
            if (err) {
                reject(err);
            }
            else {
                resolve(data);
            }
        });
    });
});
exports.deleteFile = deleteFile;
const readExcelFile = (fileName) => __awaiter(void 0, void 0, void 0, function* () {
    const params = {
        Bucket: bucketName,
        Key: fileName,
    };
    const file = s3.getObject(params).createReadStream();
    return new Promise((resolve, reject) => {
        const buffers = [];
        file.on('data', function (data) {
            buffers.push(data);
        });
        file.on('end', function () {
            const buffer = Buffer.concat(buffers);
            const workbook = xlsx_1.default.read(buffer, { type: 'buffer' });
            resolve(workbook);
        });
        file.on('error', (err) => {
            reject(err);
        });
    });
});
exports.readExcelFile = readExcelFile;
