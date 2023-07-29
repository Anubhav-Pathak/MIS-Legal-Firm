import { useState } from "react";
import Input from "@/components/UI/Input";

type FileUploadProps = {
  label: string;
  onChange: (files: File[]) => void;
  acceptedFormats: string;
  multiple?: boolean;
  required?: boolean;
  error?: string; 
};

const FileUpload = ({
  label,
  onChange,
  acceptedFormats,
  multiple,
  required,
  error, 
}: FileUploadProps) => {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      const fileList = Array.from(files);
      setSelectedFiles(fileList);
      onChange(fileList);
    }
  };

  const handleDrop = (event: React.DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
    const files = event.dataTransfer.files;
    if (files) {
      const fileList = Array.from(files);
      setSelectedFiles(fileList);
      onChange(fileList);
    }
  };

  const handleDragOver = (event: React.DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
  };

  return (
    <div className="mt-4">
      <h3 className="font-bold mb-2">{label}</h3>
      <label
        className={`flex justify-center w-full h-32 px-4 transition border-2 ${
          error
            ? "border-red-500 cursor-default"
            : "border-primary cursor-pointer"
        } border-dashed rounded-md appearance-none cursor-pointer group ${
          error ? "hover:border-red-500" : "hover:border-primary"
        } focus:outline-none`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
      >
        <span className="flex items-center">
          <span
            className={`font-medium ${
              error ? "text-red-500" : "text-gray-600"
            }`}
          >
            {error ? (
              <span>{error}</span> 
            ) : selectedFiles.length > 0 ? (
              <span>{selectedFiles.length} file(s) selected</span>
            ) : (
              <div className="btn btn-primary text-xl text-white group-hover:bg-primary">
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
          accept={acceptedFormats}
          multiple={multiple}
          required={required}
        />
      </label>
    </div>
  );
};

export default FileUpload;