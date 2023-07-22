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
import { postRead } from "@/utils/API";

const Dashboard = () => {

  const dispatch = useDispatch();

  useEffect(() => {
    const token = localStorage.getItem("token") as string;
    if(!token) window.location.href = "/";
    dispatch(fetchData(1, 5, token))
  }, []);

  return (
    <main className="p-4">
      <TimelineModal />
      <Search />
      <Filter />
      <Pagination />
      <Table />
      <Toast />
    </main>
  );
};

export default Dashboard;
