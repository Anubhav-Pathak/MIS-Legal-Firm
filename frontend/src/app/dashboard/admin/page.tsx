"use client";
import React, { useState, useEffect } from "react";
import FileUploadModal from "@/components/FileUploadModal";
import { getCompanies, deleteClient } from "@/utils/API";
import Link from "next/link";
import Loading from "@/components/UI/Loading";
import Toast from "@/components/UI/Toast";

const AdminPage = () => {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedClient, setSelectedClient] = useState(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState("");

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const { companies } = await getCompanies();
        setCompanies(companies);
        setLoading(false);
      } catch (error) {
        console.log("Error fetching companies:", error);
      }
    };

    fetchCompanies();
  }, []);

  const refetchCompanies = async () => {
    try {
      const { companies } = await getCompanies();
      setCompanies(companies);
      setLoading(false);
    } catch (error) {
      console.log("Error fetching companies:", error);
    }
  };

  const handleDeleteClient = async (clientId) => {
    try {
      await deleteClient(clientId);
      await refetchCompanies();
      setSelectedClient(null);
      setShowConfirmation(false);
      displayToast("Client deleted successfully", "success");
    } catch (error) {
      console.log("Error deleting client:", error);
      displayToast("Failed to delete client", "error");
    }
  };

  const showDeleteConfirmation = (clientId) => {
    setSelectedClient(clientId);
    setShowConfirmation(true);
  };

  const cancelDelete = () => {
    setSelectedClient(null);
    setShowConfirmation(false);
  };

  const displayToast = (message, type) => {
    setToastMessage(message);
    setToastType(type);
    setShowToast(true);
  };

  const handleCloseToast = () => {
    setShowToast(false);
  };

  return (
    <div>
      <FileUploadModal />
      <h1 className="text-4xl font-bold">Welcome, Admin</h1>
      <h2 className="text-2xl font-bold">Select a company to view data</h2>
      <div className="flex flex-row gap-2 justify-between">
        <a
          className="btn btn-primary text-white flex flex-col text-[24px] p-10 items-center justify-center gap-3"
          onClick={() => window.file_upload.showModal()}
        >
          Create Client +
        </a>
      </div>
      <div className="mt-8">
        {loading ? (
          <Loading />
        ) : companies.length > 0 ? (
          companies.map((company) => (
            <div
              className="collapse collapse-plus bg-base-200 mb-4"
              key={company.name}
            >
              <input type="radio" name="my-accordion-3" />
              <div className="collapse-title text-2xl font-medium">
                {company.name.replace(".xlsx", "")}
              </div>
              <div className="collapse-content">
                <div className="divider">Excel Info</div>
                <div className="grid card bg-base-300 rounded-box p-5">
                  <p>
                    <span className="text-lg font-bold">Size:</span>{" "}
                    {company.sizeInBytes} bytes
                  </p>
                  <p>
                    <span className="text-lg font-bold">Created At:</span>{" "}
                    <div class="badge badge-primary">
                      {new Date(company.createdAt).toString().slice(0, 25)}
                    </div>
                  </p>
                  <p>
                    <span className="text-lg font-bold">Tabs:</span>
                  </p>
                  <div className="flex gap-1">
                    {company.tabs.map((tab) => (
                      <button
                        className="btn btn-xs rounded-md btn-primary"
                        key={tab}
                      >
                        {tab}
                      </button>
                    ))}
                  </div>
                  <Link
                    href={`/dashboard/${company.name.replace(".xlsx", "")}`}
                  >
                    <div className="btn btn-primary mt-4">
                      View Dashboard for {company.name}
                    </div>
                  </Link>
                </div>
                <div className="divider">Templates</div>
                <div className="grid card bg-base-300 rounded-box p-5">
                  <p>
                    <span className="text-lg font-bold">Templates:</span>
                  </p>
                  <ul>
                    {company.templates.map((template) => (
                      <li key={template.name}>
                        <div class="badge badge-primary">{template.name}</div> -
                        (Created At:{" "}
                        {new Date(template.createdAt).toString().slice(0, 25)})
                      </li>
                    ))}
                  </ul>
                  <div className="flex flex-col w-full border-opacity-50">
                    <Link
                      href={`/dashboard/${company.name.replace(
                        ".xlsx",
                        ""
                      )}/pdf`}
                    >
                      <div className="btn btn-primary mt-4">Generate PDFs</div>
                    </Link>
                  </div>
                </div>

                <div className="flex flex-row justify-between mt-4">
                  {showConfirmation && selectedClient === company.name ? (
                    <div className="flex gap-1">
                      <p>Are you sure you want to delete this client?</p>
                      <button
                        className="btn btn-success btn-xs"
                        onClick={() =>
                          handleDeleteClient(company.name.split(" (")[0])
                        }
                      >
                        Yes
                      </button>
                      <button
                        className="btn btn-error btn-xs"
                        onClick={cancelDelete}
                      >
                        No
                      </button>
                    </div>
                  ) : (
                    <>
                      <button
                        className="btn btn-error btn-xs"
                        onClick={() => showDeleteConfirmation(company.name)}
                      >
                        Delete Client
                      </button>
                      <button
                        className="btn btn-warning btn-xs"
                        onClick={() => handleEditClient(company.name)}
                      >
                        Edit Client
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))
        ) : (
          <p>No companies found.</p>
        )}
      </div>
      <Toast
        show={showToast}
        message={toastMessage}
        styles={`alert-${toastType}`}
        onCloseHandler={handleCloseToast}
      />
    </div>
  );
};

export default AdminPage;
