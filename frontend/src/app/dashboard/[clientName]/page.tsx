"use client";
import React, { useContext, useEffect } from "react";

import DataContext, { DataContextProvider } from "@/contexts/DataContext";

import FileUploadModal from "@/components/AddUserModal";
import Search from "@/components/Search";
import Filter from "@/components/Filter";
import Pagination from "@/components/Pagination";
import Table from "@/components/Table";
import TimelineModal from "@/components/TimelineModal";
import { postRead } from "@/utils/API";
import { authActions } from "@/redux/slices/authSlice";

const Dashboard = () => {

  const dataContext = useContext(DataContext);
  const company = "srm";
  useEffect(() => {
    const token = localStorage.getItem("token") as string;
    if(!token) window.location.href = "/";
    const data = postRead(1,5,token)
  }, []);

  return (
    <DataContextProvider clientName={company}>
      {/* <ErrorToast /> */}
      <FileUploadModal />
      <TimelineModal />
      <Search />
      <Filter />
      <Pagination />
      {dataContext.data && <Table company={company} />}
    </DataContextProvider>
  );
};

export default Dashboard;
