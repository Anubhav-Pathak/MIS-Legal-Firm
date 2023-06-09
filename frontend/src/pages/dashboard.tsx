import "../assets/CSS/globals.css";
import React, { useContext } from "react";

import DataContext, { DataContextProvider } from "@/contexts/DataContext";

import Navbar from "@/components/Navbar";
import ErrorToast from "@/components/ErrorToast";
import Toast from "@/components/UI/Toast";
import FileUploadModal from "@/components/FileUploadModal";
import Search from "@/components/Search";
import Filter from "@/components/Filter";
import Pagination from "@/components/Pagination";
import Table from "@/components/Table";
import TimelineModal from "@/components/TimelineModal";

const metaData = () => {
  return (
    <div className="flex flex-row gap-2 justify-between">
      <ul className="text-xl text-black list-decimal">
        Meta Data about the File:
        {[
          "File Name",
          "File Type",
          "File Size",
          "File Uploaded By",
          "File Uploaded On",
        ].map((e, i) => (
          <li key={i}>{e}</li>
        ))}
      </ul>
      <a
        href="#upload-modal"
        className="btn btn-primary text-white flex flex-col text-[24px] p-10 items-center justify-center gap-3"
      >
        {" "}
        Upload Datasheet +{" "}
      </a>
    </div>
  );
};

const Dashboard = () => {
  const dataContext = useContext(DataContext);
  return (
    <DataContextProvider>
      <ErrorToast />
      <FileUploadModal />
      <Navbar company={""} />
      <main className="min-h-screen bg-secondary p-4 md:p-8">
        <TimelineModal />
        <Search />
        <Filter />
        <Pagination />
        {dataContext.data && <Table />}
      </main>
    </DataContextProvider>
  );
};

export default Dashboard;
