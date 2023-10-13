import React from "react";
import { useState, useEffect } from "react";
import Image from "next/image";

import { useAppDispatch } from "@/redux/hooks";
import { toastActions } from "@/redux/slices/uiSlice";
import Modal from "./UI/Modal";
import FileUpload from "./UI/FileUpload";
import { updateFile } from "@/utils/API";

const UploadFileModal = () => {
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(false);
  const [clientFile, setClientFile] = useState<File | null>(null);

  let token = "";
  useEffect(() => {
    if (typeof window !== "undefined" && window.localStorage) {
      token = localStorage.getItem("token") as string;
    }
  }, []);
  const submitHandler = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    try {
      const response = await updateFile(clientFile as Blob, token);
      if (!response) throw new Error("Something went wrong");
      else {
        dispatch(
          toastActions.showToast({
            message: "File Updated successfully",
            type: "success",
          })
        );
      }
      setClientFile(null);
    } catch (error: any) {
      dispatch(
        toastActions.showToast({ message: error.message, type: "error" })
      );
    } finally {
      setLoading(false);
      window.upload_file.close();
    }
  };

  const handleClientFileChange = (files: File[]) => {
    if (files.length > 0) {
      setClientFile(files[0]);
    }
  };

  return (
    <Modal id="upload_file" close={() => window.upload_file.close()}>
      <form onSubmit={submitHandler}>
        <FileUpload
          label="Client Excel File"
          onChange={handleClientFileChange}
          acceptedFormats=".xlsx"
          required
        />
        <button
          type="submit"
          className="btn btn-primary mt-4"
          disabled={!clientFile}
        >
          {loading ? (
            <span className="loading loading-spinner loading-xs"></span>
          ) : (
            <span className="text-neutral flex items-center gap-2 text-xl">
              Upload{" "}
              <Image
                src="/upload-icon.svg"
                width={50}
                height={50}
                alt="upload"
                className="h-6 w-6"
              />
            </span>
          )}
        </button>
      </form>
    </Modal>
  );
};

export default UploadFileModal;
