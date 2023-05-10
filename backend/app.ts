import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import mongoose from 'mongoose';

const app = express();
dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/lawfirm";
const PORT = process.env.PORT || 5000;

dotenv.config();
app.use(cors());

app.get('/', (req: any, res: any) => {
    res.send('Hello World!');
});

mongoose.set('strictQuery', false);
mongoose.connect(MONGODB_URI)
.then(() => {
    console.log("Connected to Database");
    app.listen(PORT);
})
.catch(e => console.log(e));