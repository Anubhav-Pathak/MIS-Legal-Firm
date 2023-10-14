import path from "path";
import { NextFunction, Request, Response } from "express";
import fs from "fs";
import { HydratedDocument } from "mongoose";
import * as argon2 from "argon2";

import Client from "../models/Client";
import Admin from "../models/Admin";
import { AdminInterface, ClientInterface, UploadedFile } from "../types/types";
import { deleteFile, readMetaData, uploadFile } from "../utils/s3";

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

export const postAddClient = async (req: any, res: Response, next: NextFunction) => {
  let { company, username, password } = req.body;
  try {
    company = company.replace(/\s/g, "-").toLowerCase();
    const clientFileName = `${company}.xlsx`;

    const data = await uploadFile('xlsx', clientFileName, req.file);
    if (!data) throw Error('File not uploaded');

    let hashedPassword = await argon2.hash(password);
    const user = await Client.create({company, username, password: hashedPassword, clientFile: clientFileName, pdfTemplates:[], createdBy: (req.user as AdminInterface)._id});
    if (!user) throw Error('User not created');
  
    const admin = await Admin.findById((req.user as AdminInterface)._id) as HydratedDocument<AdminInterface>;
    admin.companies.push(user._id);
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
    admin.companies.forEach((client) => {
      readMetaData('xlsx/'+client.clientFile).then((data) => {
        const fileSizeInKB = data.ContentLength / 1024;
        const fileUpdatedOn = data.LastModified;
        const updatedClient = {...client._doc, fileSizeInKB, fileUpdatedOn};
        clients.push(updatedClient);
        if (clients.length === admin.companies.length) {
          res.status(200).send({ clients });
        }
      })
    });
  } catch (err: any){
    if (!err.statusCode) err.statusCode = 500;
    next(err);
  } 
};

export const deleteClient = async (req: Request, res: Response) => {
  let clientId = req.params.clientId;
  const client = await Client.findById(clientId) as ClientInterface;
  try {
    await Client.findByIdAndDelete(clientId);
    deleteFile('xlsx/'+client.clientFile);
    const admin = await Admin.findById((req.user as AdminInterface)._id) as HydratedDocument<AdminInterface>;
    const updatedCompanies = admin.companies.filter((company) => company.toString() !== clientId);
    admin.companies = updatedCompanies;
    await admin.save();
    res.status(200).send({ message: "Client deleted successfully" });
  } catch (error: any) {
    if (!error.statusCode) error.statusCode = 500;
    res.status(error.statusCode).send({ error: error.message });
  }
};

export const updateFile = async (req: Request, res: Response, next: NextFunction) => {
  const user = req.user as ClientInterface;
  try {
    if (req.file) {
      const clientFileName = `${user.company}.xlsx`;
      const data = await uploadFile('xlsx', clientFileName, req.file);
      if (!data) throw Error('File not uploaded');
      res.status(200).send({ message: "File updated successfully" });
    }
  } catch (err: any) {
    console.error("Error:", err);
    if (!err.statusCode) err.statusCode = 500;
    next(err);
  }
};