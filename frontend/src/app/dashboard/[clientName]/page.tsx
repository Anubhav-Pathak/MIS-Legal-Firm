"use client";
import React, { useEffect } from "react";
import { useDispatch } from "react-redux";

import Search from "@/components/Search";
import Filter from "@/components/Filter";
import Pagination from "@/components/Pagination";
import Table from "@/components/Table";
import TimelineModal from "@/components/TimelineModal";
import Toast from "@/components/UI/Toast";

import { fetchData } from "@/redux/slices/dataSlice";
import { useAppSelector } from "@/redux/hooks";
import Loading from "@/components/UI/Loading";
import UploadFileModal from "@/components/UploadFileModal";
import Button from "@/components/UI/Button";
import AddFilterModal from "@/components/AddFilterModal";

const Dashboard = () => {
  const dispatch = useDispatch();
  const {data, isLoading, pages, limit, currentTab, search} = useAppSelector(state => state.dataReducer);

  useEffect(() => {
    const token = localStorage?.getItem("token");
    if(!token) window.location.href = "/";
    dispatch(fetchData(pages, limit, currentTab, search) as any);
  }, [currentTab, search]);

  return (
    <main className="p-4">
      <TimelineModal />
      <UploadFileModal />
      <AddFilterModal />
      <div className="flex items-center justify-between">
        <Search />
        <Button styles="btn-primary" clickHandler={()=>window.upload_file.showModal()}>Update File</Button>
      </div>
      <Filter />
      <Pagination />
      {isLoading ? <Loading /> : <Table data={data}/>}
      <Toast />
    </main>
  );
};

export default Dashboard;
