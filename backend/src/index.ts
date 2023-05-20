import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import mongoose from 'mongoose';
import router from './routes/xlsxRoutes.js';
import fileUpload from 'express-fileupload';

const app = express();
dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/lawfirm";
const PORT = process.env.PORT || 5000;

dotenv.config();
app.use(cors());
app.use(express.json())
app.use(fileUpload())
app.use("/", router);

app.get('/', (req: any, res: any) => {
    res.status(200).send('API is working properly');
});
app.get('/api', (req: any, res: any) => {
    res.status(200).send({ message: 'API Page' });
});

mongoose.set('strictQuery', false);
mongoose.connect(MONGODB_URI)
    .then(() => {
        console.log("Connected to Database");
    })
    .catch(e => console.log(e));

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})