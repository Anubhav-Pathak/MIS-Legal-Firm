import { useState } from "react";
import Input from "@/components/UI/Input";

type FileUploadProps = {
  label: string;
  onChange: (files: File[]) => void;
  acceptedFormats: string;
  multiple?: boolean;
  required?: boolean;
};

const FileUpload = ({
  label,
  onChange,
  acceptedFormats,
  multiple,
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
        className="flex justify-center w-full h-32 px-4 transition border-2 border-red-800 border-dashed rounded-md appearance-none cursor-pointer group hover:border-red-700 focus:outline-none"
        onDrop={handleDrop}
        onDragOver={handleDragOver}
      >
        <span className="flex items-center">
          <span className="font-medium text-gray-600">
            {selectedFiles.length > 0 ? (
              <span>{selectedFiles.length} file(s) selected</span>
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
          accept={acceptedFormats}
          multiple={multiple}
        />
      </label>
    </div>
  );
};

export default FileUpload;
