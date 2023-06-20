import path from "path";
import { v4 as uuidv4 } from "uuid";
import { Request, Response } from "express";
import fs from "fs";

interface UploadedFile {
  name: string;
  mv: (path: string) => Promise<void>;
}

const xlsxBasePath = path.join("src", "data", "xlsx");
const templatesBasePath = path.join("src", "data", "templates");

//todo: all client Names should be converted to client IDs

export const createClient = async (req: Request, res: Response) => {
  if (!req.files) {
    return res.status(400).send({ msg: "No file uploaded" });
  }

  const { clientName, username, password } = req.body;
  const clientFile = req.files?.clientFile as UploadedFile;
  const templateFiles = Array.isArray(req.files?.templateFiles)
    ? req.files.templateFiles
    : [req.files.templateFiles];

  const id: string = uuidv4();
  const xlsxPath = path.join(xlsxBasePath, clientName);
  const templatesPath = path.join(templatesBasePath, clientName);

  try {
    if (fs.existsSync(xlsxPath)) {
      fs.rmdirSync(xlsxPath, { recursive: true });
    }

    if (fs.existsSync(templatesPath)) {
      fs.rmdirSync(templatesPath, { recursive: true });
    }

    fs.mkdirSync(xlsxPath, { recursive: true });
    fs.mkdirSync(templatesPath, { recursive: true });

    if (clientFile) {
      const clientFileName = `${clientName} (${id}).xlsx`;
      const clientFilePath = path.join(xlsxPath, clientFileName);

      try {
        await clientFile.mv(clientFilePath);
      } catch (error) {
        console.error("Error:", error);
        res.status(500).send({ error: "Error saving xlsx file" });
        return;
      }
    }

    const saveTemplatePromises = templateFiles.map(
      async (file: UploadedFile, index: number) => {
        const templateFileName = `${clientName} (${id}) - ${index + 1}.pdf`;
        const templateFilePath = path.join(templatesPath, templateFileName);

        try {
          await file.mv(templateFilePath);
        } catch (error) {
          console.error("Error:", error);
          res
            .status(500)
            .send({ error: `Error saving templates file - ${index + 1}` });
          return;
        }
      }
    );

    await Promise.all(saveTemplatePromises);

    res.status(200).send({ message: "Files uploaded successfully" });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send({ error: "Error saving files" });
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
