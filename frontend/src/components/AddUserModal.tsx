import React, { useState } from "react";
import Image from "next/image";
import { useAppDispatch } from "@/redux/hooks";

import Input from "@/components/UI/Input";
import FileUpload from "@/components/UI/FileUpload";
import { createClient } from "@/utils/API";
import Modal from "./UI/Modal";
import { toastActions } from "@/redux/slices/uiSlice";
import { ClientInterface } from "@/utils/Types";

const AddUserModal = () => {
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(false);
  const [company, setCompany] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [clientFile, setClientFile] = useState<File | null>(null);
  const [companyError, setCompanyError] = useState("");
  const [usernameError, setUsernameError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [fileError, setFileError] = useState("");
  const token = localStorage.getItem("token") as string;

  const validateInputs = () => {
    let isValid = true;
    if (company.trim().length === 0) {
      setCompanyError("Company name is required.");
      isValid = false;
    } else {
      setCompanyError("");
    }

    if (username.trim().length === 0) {
      setUsernameError("Username is required.");
      isValid = false;
    } else {
      setUsernameError("");
    }

    if (password.trim().length === 0) {
      setPasswordError("Password is required.");
      isValid = false;
    } else {
      setPasswordError("");
    }

    return isValid;
  };

  const submitHandler = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!validateInputs()) {
      return;
    }
    setCompany(company.replace(" ", "-").toLowerCase());

    if (!clientFile || !clientFile.name.toLowerCase().endsWith(".xlsx")) {
      setFileError("Please upload an XLSX file.");
      return;
    }

    setLoading(true);
    try {
      const response = await createClient(
        { company, username, password, clientFile } as ClientInterface,
        token
      );
      if (!response) throw new Error("Something went wrong");
      else {
        dispatch(
          toastActions.showToast({
            message: "Client created successfully",
            type: "success",
          })
        );
      }
      setCompany("");
      setUsername("");
      setPassword("");
      setClientFile(null);
    } catch (error: any) {
      dispatch(
        toastActions.showToast({ message: error.message, type: "error" })
      );
    } finally {
      setLoading(false);
      window.create_user.close();
    }
  };

  const handleClientFileChange = (files: File[]) => {
    if (files.length > 0) {
      setClientFile(files[0]);
    }
  };

  return (
    <Modal id="create_user" close={() => window.create_user.close()}>
      <form onSubmit={submitHandler}>
        <div className="max-w-xl py-4">
          <Input
            style="mb-4"
            label="Company Name"
            input={{
              type: "text",
              id: "company",
              className: "block input input-bordered w-full mt-2",
              value: company,
              onChange: (event: React.ChangeEvent<HTMLInputElement>) =>
                setCompany(event.target.value),
              minLength: 3,
              maxLength: 50,
              required: true,
            }}
            error={companyError}
          />
          <Input
            style="mb-4"
            label="Username"
            input={{
              type: "text",
              id: "Username",
              className: "block input input-bordered w-full mt-2",
              value: username,
              onChange: (event: React.ChangeEvent<HTMLInputElement>) =>
                setUsername(event.target.value),
              minLength: 3,
              maxLength: 50,
              required: true,
            }}
            error={usernameError}
          />
          <Input
            style="mb-4"
            label="Password"
            input={{
              type: "password",
              id: "password",
              className: "block input input-bordered w-full mt-2",
              value: password,
              onChange: (event: React.ChangeEvent<HTMLInputElement>) =>
                setPassword(event.target.value),
              minLength: 3,
              maxLength: 50,
              required: true,
            }}
            error={passwordError}
          />
          <FileUpload
            label="Client Excel File"
            onChange={handleClientFileChange}
            acceptedFormats=".xlsx" 
            required
            error={fileError} 
          />
        </div>
        <button
          type="submit"
          className="btn btn-primary gap-2"
          disabled={!company || !username || !password || !clientFile}
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

export default AddUserModal;