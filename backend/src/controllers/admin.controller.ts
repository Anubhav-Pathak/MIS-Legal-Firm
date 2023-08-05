import path from "path";
import { NextFunction, Request, Response } from "express";
import fs, { PathLike } from "fs";
import { HydratedDocument } from "mongoose";
import * as argon2 from "argon2";

import Client from "../models/Client";
import Admin from "../models/Admin";
import { AdminInterface, ClientInterface, UploadedFile } from "../types/types";

const xlsxBasePath = path.join("src", "data", "xlsx");

export const postAddAdmin = async (req: Request, res: Response, next: NextFunction) => {
  const { company, username, password } = req.body;
  try {
    let hashedPassword = await argon2.hash(password);
    const user = await Admin.create({company, username, password: hashedPassword, companies: []});
    if (!user) throw Error('Admin not created');
    res.status(200).send({ message: "Admin added successfully" });
  } catch (err: any) {
    if (!err.statusCode) err.statusCode = 500;
    next(err);
  }
};

export const postAddClient = async (req: Request, res: Response, next: NextFunction) => {
  let { company, username, password } = req.body;
  const clientFile = req.files?.clientFile as UploadedFile;
  try {
    company = company.replace(/\s/g, "-").toLowerCase();
    const clientFileName = `${company}.xlsx`;
    const clientFilePath = path.join(xlsxBasePath, clientFileName);
    let hashedPassword = await argon2.hash(password);
    const user = await Client.create({company, username, password: hashedPassword, clientFile: clientFilePath, pdfTemplates:[], createdBy: (req.user as AdminInterface)._id});
    if (!user) throw Error('User not created');
    await clientFile.mv(clientFilePath);
    const admin = await Admin.findById((req.user as AdminInterface)._id) as HydratedDocument<AdminInterface>;
    admin.companies.push(user._id as any);
    await admin.save();
    res.status(200).send({ message: "User added successfully" });
  } catch (err: any) {
    if (!err.statusCode) err.statusCode = 500;
    next(err);
  }
};

export const getCompanies = async (req: Request, res: Response, next: NextFunction) => {
  try{
    const clients : Array<ClientInterface> = [];
    const user = req.user as AdminInterface;
    const admin = await Admin.findById(user._id).populate('companies') as AdminInterface;
    if (!admin) throw ({statusCode: 404, message: "No companies found"});
    admin.companies.forEach((client: ClientInterface | any) => {
      const worksheetPath = path.join(xlsxBasePath, client.company + ".xlsx");
      const fileSizeInKB = fs.statSync(worksheetPath).size / 1024;
      const fileUpdatedOn = fs.statSync(worksheetPath).mtime;
      const updatedClient = {...client._doc, fileSizeInKB, fileUpdatedOn};
      clients.push(updatedClient);
    });
    res.status(200).send({ clients });
  } catch (err: any){
    if (!err.statusCode) err.statusCode = 500;
    next(err);
  } 
};

export const deleteClient = async (req: Request, res: Response) => {
  let clientId = req.params.clientId;
  const client = await Client.findById(clientId) as ClientInterface;
  const xlsxPath = path.join(xlsxBasePath, client.company + ".xlsx");
  try {
    await Client.findByIdAndDelete(clientId);
    fs.unlinkSync(xlsxPath);
    const admin = await Admin.findById((req.user as AdminInterface)._id) as HydratedDocument<AdminInterface>;
    const updatedCompanies = admin.companies.filter((company) => company.toString() !== clientId);
    admin.companies = updatedCompanies as any;
    await admin.save();
    res.status(200).send({ message: "Client deleted successfully" });
  } catch (error: any) {
    if (!error.statusCode) error.statusCode = 500;
    res.status(error.statusCode).send({ error: error.message });
  }
};

export const updateFile = async (req: Request, res: Response, next: NextFunction) => {
  const user = req.user as ClientInterface;
  const clientFile = req.files?.clientFile as UploadedFile;
  try {
    if (clientFile) {
      const clientFileName = `${user.company}.xlsx`;
      const clientFilePath = path.join(xlsxBasePath, clientFileName);
      await clientFile.mv(clientFilePath);
      res.status(200).send({ message: "File updated successfully" });
    }
  } catch (err: any) {
    console.error("Error:", err);
    if (!err.statusCode) err.statusCode = 500;
    next(err);
  }
};