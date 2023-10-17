"use client";
import React, { useEffect } from "react";
import { useDispatch } from "react-redux";

import Search from "@/components/Search";
import Filter from "@/components/Filter";
import Pagination from "@/components/Pagination";
import Table from "@/components/Table";
import TimelineModal from "@/components/TimelineModal";
import Toast from "@/components/UI/Toast";
import Navbar from "@/components/Navbar";

import { fetchData } from "@/redux/slices/dataSlice";
import { useAppSelector } from "@/redux/hooks";
import Loading from "@/components/UI/Loading";
import UploadFileModal from "@/components/UploadFileModal";
import Button from "@/components/UI/Button";
import AddFilterModal from "@/components/AddFilterModal";
import { verifyToken } from "@/redux/slices/authSlice";

const Dashboard = () => {
  const dispatch = useDispatch();
  const {data, isLoading, pages, limit, currentTab, search, filters} = useAppSelector(state => state.dataReducer);
  const isAdmin = useAppSelector(state => state.authReducer.isAdmin);

  const token = localStorage.getItem("token") as string;

  if(!token) window.location.href = "/";
  dispatch(verifyToken(token as string) as any)

  useEffect(() => {
    dispatch(fetchData(pages, limit, currentTab, search, filters) as any);
  }, [currentTab, search, filters]);

  return (
    <>
    <Navbar />
    <main className="p-4">
      <TimelineModal />
      {isAdmin && <UploadFileModal />}
      <AddFilterModal />
      <div className="flex items-center justify-between">
        <Search />
        {isAdmin && <Button styles="btn-primary" clickHandler={()=>window.upload_file.showModal()}>Update File</Button>}
      </div>
      <Filter />
      <Pagination />
      {isLoading ? <Loading /> : <Table data={data}/>}
      {/* <p className="mt-12 text-center">Page {pages} of {Math.ceil(data.results.length + data.remainingData / limit)} </p> */}
      <Toast />
    </main>
    </>
  );
};

export default Dashboard;
