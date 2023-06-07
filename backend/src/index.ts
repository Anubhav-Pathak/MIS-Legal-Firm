import express, { NextFunction, Request, Response } from 'express';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import cors from 'cors';
import mongoose from 'mongoose';
import router from './routes/adminRoutes';
import fileUpload from 'express-fileupload';
import path from 'path';

const app = express();
dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/lawfirm";
const PORT = process.env.PORT || 5000;

dotenv.config();
app.use(cors());
app.set("view engine", "pug");
app.set("views", "src/views");
app.use(express.json())
app.use(fileUpload())
app.use(bodyParser.urlencoded({extended: false})); 
app.use(express.static(path.join(path.resolve(),"data")));
app.use(express.static(path.join(path.resolve(),"public")));

app.get('/', (req: any, res: any) => {
    res.render('index');
});

app.use('/api', router);

app.use((error: any, req: Request, res: Response, next: NextFunction) => {
    console.log(error);
    const status = error.statusCode || 500;
    const message = error.message;
    const data = error.data;
    res.status(status).json({message: message, data: data});
});

mongoose.set('strictQuery', false);
mongoose.connect(MONGODB_URI)
.then(() => {
    console.log("Connected to Database");
})
.then(() => {
    
})
.catch(e => console.log(e));

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});