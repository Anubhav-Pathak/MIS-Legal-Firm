"use client";
import React, { useContext } from "react";

import DataContext, { DataContextProvider } from "@/contexts/DataContext";

import FileUploadModal from "@/components/AddUserModal";
import Search from "@/components/Search";
import Filter from "@/components/Filter";
import Pagination from "@/components/Pagination";
import Table from "@/components/Table";
import TimelineModal from "@/components/TimelineModal";

const Dashboard = ({ params }: { params: { clientName: string } }) => {
  const company = params.clientName.replace(/%20/g, " ").replace(/%26/g, "&");
  const dataContext = useContext(DataContext);
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
