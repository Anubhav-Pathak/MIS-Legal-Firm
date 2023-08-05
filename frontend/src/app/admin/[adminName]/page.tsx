"use client";
import React, { useState, useEffect, Dispatch, Key } from "react";

import AddUserModal from "@/components/AddUserModal";
import { getCompanies } from "@/utils/API";

import Loading from "@/components/UI/Loading";
import Toast from "@/components/UI/Toast";
import UploadFileModal from "@/components/UploadFileModal";
import CompanyCollapse from "@/components/CompanyCollapse";
import { ClientInterface } from "@/utils/Types";
import { useAppDispatch } from "@/redux/hooks";
import { authActions } from "@/redux/slices/authSlice";
import { toastActions } from "@/redux/slices/uiSlice";

const AdminPage = () => {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token") as string;
  
  const dispatch = useAppDispatch();
  
  useEffect(() => {
    if(!token) window.location.href = "/";
    (async () => {
      try {
        setLoading(true);
        const { clients } = await getCompanies(token);
        setClients(clients);
      } catch (error: any) {
        dispatch(toastActions.showToast({ message: error.message, type: "error" }))
      } finally {
        setLoading(false);
      }
    })();
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
          clients.map((client: ClientInterface, index: Key) => <CompanyCollapse client={client} key={index}/>)) : <p>No clients found.</p>
        }
      </section>
      <Toast />
    </>
  );
};

export default AdminPage;
