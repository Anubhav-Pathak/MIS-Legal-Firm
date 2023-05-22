"use client";
import { useState, ChangeEvent, DragEvent } from "react";
import Image from "next/image";

const FileUploadModal = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    setSelectedFile(file || null);
  };

  const handleDrop = (event: DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
    const file = event.dataTransfer.files?.[0];
    setSelectedFile(file || null);
  };

  const handleDragOver = (event: DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
  };

  const handleUpload = () => {
    console.log("uploading");
    // TODO: upload file to server
  };

  return (
    <div className="modal" id="upload-modal">
      <div className="modal-box bg-gray-200">
        <h2 className="text-2xl font-bold text-black">Upload File</h2>
        <div className="max-w-xl py-4">
          <label
            className="flex justify-center w-full h-32 px-4 transition border-2 border-red-800 border-dashed rounded-md appearance-none cursor-pointer group hover:border-red-700 focus:outline-none"
            onDrop={handleDrop}
            onDragOver={handleDragOver}
          >
            <span className="flex items-center">
              <span className="font-medium text-gray-600">
                {selectedFile ? (
                  <span>{selectedFile.name}</span>
                ) : (
                  <div className="btn btn-primary text-xl text-white group-hover:bg-red-700">
                    Drop files to Attach, or Browse
                  </div>
                )}
              </span>
            </span>
            <input
              type="file"
              name="file_upload"
              className="hidden"
              onChange={handleFileChange}
              accept="application/xlsx"
            />
          </label>
        </div>
        <div className="modal-action">
          <a className="btn btn-primary gap-2" href="#" onClick={handleUpload}>
            <span className="text-xl text-white">Upload</span>
            <Image
              src="/upload-icon.svg"
              width={50}
              height={50}
              alt="upload"
              className="h-6 w-6"
            />
          </a>
        </div>
      </div>
    </div>
  );
};

export default FileUploadModal;
