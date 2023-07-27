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

const Dashboard = () => {

  const dispatch = useDispatch();
  const {data, isLoading} = useAppSelector(state => state.dataReducer);
  useEffect(() => {
    const token = localStorage?.getItem("token") as string;
    if(!token) window.location.href = "/";
    dispatch(fetchData(1, 5, token));
  }, []);

  return (
    <main className="p-4">
      <TimelineModal />
      <Search />
      <Filter />
      <Pagination />
      {isLoading ? <Loading /> : <Table data={data}/>}
      <Toast />
    </main>
  );
};

export default Dashboard;
