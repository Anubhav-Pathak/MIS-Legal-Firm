"use client";
import React, { useEffect } from "react";
import { useDispatch } from "react-redux";

import Search from "@/components/Search";
import Filter from "@/components/Filter";
import Pagination from "@/components/Pagination";
import Table from "@/components/Table";
import TimelineModal from "@/components/TimelineModal";
import Toast from "@/components/UI/Toast";

import { dataActions, fetchData } from "@/redux/slices/dataSlice";
import { postRead } from "@/utils/API";
import { useAppSelector } from "@/redux/hooks";
import Loading from "@/components/UI/Loading";
import { useSearchParams } from "next/navigation";
import UploadFileModal from "@/components/UploadFileModal";
import Button from "@/components/UI/Button";

const Dashboard = () => {
  const dispatch = useDispatch();
  const admin = useSearchParams().get("admin") === "true";
  let client = JSON.parse(localStorage.getItem("client") as string);
  const isAdmin = admin && client;
  dispatch(dataActions.changeAdmin(isAdmin));
  const {data, isLoading} = useAppSelector(state => state.dataReducer);
  useEffect(() => {
    const token = localStorage?.getItem("token") as string;
    if(!token) window.location.href = "/";
    if (isAdmin) dispatch(fetchData(1, 5, token, true, client));
    else dispatch(fetchData(1, 5, token));
  }, []);

  return (
    <main className="p-4">
      <TimelineModal />
      <UploadFileModal />
      <div className="flex items-center justify-between">
        <Search />
        {isAdmin && <Button styles="btn-primary" onClick={()=>window.upload_file.showModal()}>Update File</Button>}
      </div>
      <Filter />
      <Pagination />
      {isLoading ? <Loading /> : <Table data={data}/>}
      <Toast />
    </main>
  );
};

export default Dashboard;
