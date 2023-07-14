import path from "path";
import { NextFunction, Request, Response } from "express";
import fs from "fs";
import XLSX from "xlsx";
import * as argon2 from "argon2";

import User, {UserInterface} from "../models/User";
interface UploadedFile {
  name: string;
  mv: (path: string) => Promise<void>;
}

const xlsxBasePath = path.join("src", "data", "xlsx");
const templatesBasePath = path.join("src", "data", "templates");

export const postAddUser = async (req: Request, res: Response, next: NextFunction) => {
  const { company, username, password } = req.body;
  const clientFile = req.files?.clientFile as UploadedFile;
  const xlsxPath = path.join(xlsxBasePath);
  try {
    const clientFileName = `${company}.xlsx`;
    const clientFilePath = path.join(xlsxPath, clientFileName);
    let hashedPassword = await argon2.hash(password);
    const user = await User.create({company,username,password: hashedPassword,clientFile: clientFilePath,pdfTemplates:[]});
    if (!user) throw Error('User not created');
    await clientFile.mv(clientFilePath);
    res.status(200).send({ message: "User added successfully" });
  } catch (err: any) {
    if (!err.statusCode) err.statusCode = 500;
    next(err);
  }
};

export const deleteClient = async (req: Request, res: Response) => {
  const { clientName } = req.params;
  const xlsxPath = path.join(xlsxBasePath, clientName);
  const templatesPath = path.join(templatesBasePath, clientName);

  try {
    if (fs.existsSync(xlsxPath)) {
      fs.rmdirSync(xlsxPath, { recursive: true });
    } else res.status(404).send({ error: "Client xlsx file not found" });

    if (fs.existsSync(templatesPath)) {
      fs.rmdirSync(templatesPath, { recursive: true });
    } else res.status(404).send({ error: "Client templates file not found" });

    res.status(200).send({ message: "Client deleted successfully" });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send({ error: "Error deleting client" });
  }
};

export const editClient = async (req: Request, res: Response) => {
  const { clientName } = req.params;
  const { newClientCredentials } = req.body;
  try {
    console.log({ clientName, newClientCredentials });
    //todo: edit client credentials

    res.status(200).send({ message: "Client edited successfully" });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send({ error: "Error editing client" });
  }
};

export const getUsers = async (req: Request, res: Response, next: NextFunction) => {
  try{
    const users = await User.find().select("-password");
    if (!users) throw Error("Users not found");
    const clients: any = [];
    users.map((user: any) => {
      const stats = fs.statSync(user.clientFile);
      const sizeInBytes = stats.size;
      const fileCreatedOn = stats.birthtime;
      clients.push({ 
        ...user._doc,
        sizeInBytes,
        fileCreatedOn,
      });
    });
    res.status(200).send({ clients });  
  } catch (err: any){
    if (!err.statusCode) err.statusCode = 500;
    next(err);
  }
};