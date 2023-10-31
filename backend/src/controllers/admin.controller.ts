import path from "path";
import { NextFunction, Request, Response } from "express";
import fs from "fs";
import { generateOTP, verifyOTP } from "../utils/twilitoHandller";
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

export async function generateOtp(req: Request, res: Response): Promise<void> {
  try {
    console.log("Generating OTP");
    const { phoneNumber } = req.body;
    const client = await Client.find({ phoneNumber });
    if (!client) {
      res.status(404).send({ message: "User not found" });
      return;
    }
    await generateOTP(phoneNumber);
    res.status(200).send({ message: "OTP sent" });
  } catch (e: any) {
    res.status(500).send({ message: "Oops! Something went wrong" });
  }
}

export async function verifyOtp(req: Request, res: Response): Promise<void> {
  try {
    console.log("Verifying OTP")
    const { phoneNumber, code, password } = req.body;
    const client = await Client.findOne({ phone: phoneNumber })
    if (!client) {
      res.status(404).send({ message: "User not found" });
      return;
    }
    const verified = await verifyOTP(phoneNumber, code);
    if (!verified) {
      res.status(403).send({"message": "Invalid OTP"});
    }
    client.password = await argon2.hash(password);
    await client.save();
    res.status(200).send({ message: "Password updated successfully" });
  } catch (e: any) {
    console.log(e)
    res.status(500).send({ message: e.message });
  }
}