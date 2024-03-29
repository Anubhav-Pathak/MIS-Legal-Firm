import express, { NextFunction, Request, Response } from "express";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import cors from "cors";
import mongoose from "mongoose";
import path from "path";

import userRouter from "./routes/userRoutes";
import pdfRouter from "./routes/pdfRoutes";
import adminRouter from "./routes/adminRoutes";

import signIn, {verify} from "./controllers/auth.controller";


const app = express();
dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/lawfirm";
const PORT = process.env.PORT || 5000;

dotenv.config();
app.use(cors());
app.set("view engine", "pug");
app.set("views", "src/views");
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(path.resolve(), "data")));
app.use(express.static(path.join(path.resolve(), "public")));

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});

app.post("/api/sign-in", signIn);
app.post("/api/verify", verify)

app.use("/api", userRouter);
app.use("/api/pdf", pdfRouter);
app.use("/api/admin", adminRouter);

app.use((error: any, req: Request, res: Response, next: NextFunction) => {
  console.log(error);
  const status = error.statusCode || 500;
  const message = error.message;
  const data = error.data;
  return res.status(status).json({ message: message, data: data });
});

mongoose.set("strictQuery", false);
mongoose
  .connect(MONGODB_URI)
  .then(() => {
    console.log("Connected to Database");
  })
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((e) => console.log(e));