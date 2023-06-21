"use client";
import React, { useState } from "react";
import Image from "next/image";
import Input from "@/components/UI/Input";
import FileUpload from "@/components/UI/FileUpload";
import { createClient } from "@/utils/API";
import Toast from "@/components/UI/Toast";
import Loading from "@/components/UI/Loading";

const FileUploadModal = () => {
  const [clientName, setclientName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [clientFile, setClientFile] = useState<File | null>(null);
  const [templateFiles, setTemplateFiles] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toast, setToast] = useState({
    show: false,
    type: "success",
    message: "",
  });

  const handleClientFileChange = (files: File[]) => {
    if (files.length > 0) {
      setClientFile(files[0]);
    }
  };

  const handleTemplateFileChange = (files: File[]) => {
    setTemplateFiles(files);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (
      !clientName ||
      !username ||
      !password ||
      !clientFile ||
      templateFiles.length === 0
    ) {
      return;
    }

    setIsSubmitting(true);

    const clientData = {
      clientName,
      username,
      password,
      clientFile: clientFile as File,
      templateFiles: templateFiles as File[],
    };

    try {
      setToast({
        show: true,
        type: "info",
        message: "Uploading...",
      });

      await createClient(clientData);

      setToast({
        show: true,
        type: "success",
        message: "Client uploaded successfully.",
      });

      setclientName("");
      setUsername("");
      setPassword("");
      setClientFile(null);
      setTemplateFiles([]);
    } catch (error) {
      setToast({
        show: true,
        type: "error",
        message: "An error occurred while creating the client.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToastClose = () => {
    setToast({
      show: false,
      type: "success",
      message: "",
    });
  };

  return (
    <dialog className="modal" id="file_upload">
      <Toast
        show={toast.show}
        styles={`alert-${toast.type}`}
        message={toast.message}
        onCloseHandler={handleToastClose}
      />
      <div className="modal-box bg-gray-200">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-black">Add a client</h2>
          <button className="btn btn-circle btn-primary" onClick={() => window.file_upload.close()}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {isSubmitting && <Loading bg="primary" message="Uploading..." />}

        <form
          onSubmit={handleSubmit}
          className={`${isSubmitting ? "hidden" : ""}`}
        >
          <div className="max-w-xl py-4">
            <div className="mb-4">
              <label className="block mb-2" htmlFor="clientName">
                Company Name
              </label>
              <input
                type="text"
                id="clientName"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none"
                value={clientName}
                onChange={(e) => setclientName(e.target.value)}
                required
              />
            </div>
            <div className="mb-4">
              <label className="block mb-2" htmlFor="username">
                Username
              </label>
              <Input
                input={{
                  type: "text",
                  id: "username",
                  className:
                    "w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none",
                  value: username,
                  onChange: (e: React.ChangeEvent<HTMLInputElement>) =>
                    setUsername(e.target.value),
                  required: true,
                }}
              />
            </div>
            <div className="mb-4">
              <label className="block mb-2" htmlFor="password">
                Password
              </label>
              <Input
                input={{
                  type: "password",
                  id: "password",
                  className:
                    "w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none",
                  value: password,
                  onChange: (e: React.ChangeEvent<HTMLInputElement>) =>
                    setPassword(e.target.value),
                  required: true,
                }}
              />
            </div>

            <FileUpload
              label="Client Excel File"
              onChange={handleClientFileChange}
              acceptedFormats=".xlsx"
              required
            />

            <FileUpload
              label="Template PDF Files"
              onChange={handleTemplateFileChange}
              acceptedFormats=".pdf"
              multiple
              required
            />
          </div>

          <div className="modal-action">
            <button
              type="submit"
              className="btn btn-primary gap-2"
              disabled={
                !clientName ||
                !username ||
                !password ||
                !clientFile ||
                templateFiles.length === 0 ||
                isSubmitting
              }
            >
              <span className="text-xl text-white">Upload</span>
              <Image
                src="/upload-icon.svg"
                width={50}
                height={50}
                alt="upload"
                className="h-6 w-6"
              />
            </button>
          </div>
        </form>
      </div>
    </dialog>
  );
};

export default FileUploadModal;
