"use client";
import React, { use, useEffect } from "react";
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
  const client: Object|null = JSON.parse(localStorage.getItem("client") as string);
  const isAdmin = admin && client ? true : false;
  dispatch(dataActions.changeAdmin(isAdmin));
  const {data, isLoading, pages, limit} = useAppSelector(state => state.dataReducer);

  useEffect(() => {
    const token = localStorage?.getItem("token") as string;
    if(!token) window.location.href = "/";
    dispatch(fetchData(pages, limit, token, isAdmin, client));
  }, []);

  return (
    <main className="p-4">
      <TimelineModal />
      <UploadFileModal />
      <div className="flex items-center justify-between">
        <Search />
        {isAdmin && <Button styles="btn-primary" clickHandler={()=>window.upload_file.showModal()}>Update File</Button>}
      </div>
      <Filter />
      <Pagination />
      {isLoading ? <Loading /> : <Table data={data}/>}
      <Toast />
    </main>
  );
};

export default Dashboard;
