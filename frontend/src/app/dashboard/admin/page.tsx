"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";

import AddUserModal from "@/components/AddUserModal";
import { getCompanies } from "@/utils/API";

import Loading from "@/components/UI/Loading";
import Toast from "@/components/UI/Toast";
import Collapse from "@/components/UI/Collapse";
import UploadFileModal from "@/components/UploadFileModal";
import CompanyCollapse from "@/components/CompanyCollapse";

const AdminPage = () => {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token") as string;

  useEffect(() => {
    const token = localStorage.getItem("token") as string;
    if(!token) window.location.href = "/";
    const fetchCompanies = async () => {
      try {
        const { clients } = await getCompanies(token);
        setClients(clients);
        setLoading(false);
      } catch (error) {
        console.log("Error fetching companies:", error);
      }
    };
    fetchCompanies();
  }, []);

  return (
    <>
      <AddUserModal />
      <UploadFileModal />
      <section className="flex flex-wrap items-center justify-between p-4">
        <h1 className="text-4xl font-bold">Welcome</h1>
        <button className="btn btn-primary" onClick={()=>window.create_user.showModal()} > Create Client + </button>
      </section>
      <section className="mt-8 flex flex-col gap-4 p-8">
        <h2 className="text-2xl font-bold mb-4">Clients -</h2>
        {loading ? <Loading /> : clients.length > 0 ? (
          clients.map((client, index) => <CompanyCollapse client={client} key={index}/>)) : <p>No clients found.</p>
        }
      </section>
      <Toast />
    </>
  );
};

export default AdminPage;
