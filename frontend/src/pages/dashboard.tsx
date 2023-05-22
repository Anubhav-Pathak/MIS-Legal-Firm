import '../assets/CSS/globals.css'
import React from "react";
import Image from "next/image";
import Navbar from "../components/Navbar";
import Search from "../components/Search";
import Table from "../components/UI/Table";
import Select from "../components/UI/Select";
import FileUploadModal from "../components/FileUploadModal";
import { DataContextProvider } from '@/contexts/DataContext';

const metaData = () => {
  return (
    <div className="flex flex-row gap-2 justify-between">
      <ul className="text-xl text-black list-decimal">Meta Data about the File:{
        ["File Name", "File Type", "File Size", "File Uploaded By", "File Uploaded On", ].map((e, i) => (
          <li key={i}>{e}</li>
        ))
      }</ul>
      <a href="#upload-modal" className="btn btn-primary text-white flex flex-col text-[24px] p-10 items-center justify-center gap-3"> Upload Datasheet + </a>
    </div>
  )
};

const Dashboard = () => {
  return (
    <DataContextProvider>
      <FileUploadModal />
      <Navbar company={""} />
      <main className="flex flex-col min-h-screen bg-gray-200 px-8">
        <div className="flex flex-col">
          <div className="text-2xl text-black font-bold mb-2">Search Case:</div>
          <Search />
        </div>
        <div className="flex flex-col bg-white p-5 shadow-sm gap-4">
          <div className="text-2xl text-black font-bold">Filter By-</div>
          <div className="flex flex-row justify-between">
            <Select options={[{ value: "Date" }]} title="Date -" />
            <Select options={[{ value: "Type" }]} title="Type - " />
            <Select options={[{ value: "foo" }]} />
            <Select options={[{ value: "bar" }]} />
          </div>
        </div>
    </main>
    </DataContextProvider>
  );
};

export default Dashboard;
