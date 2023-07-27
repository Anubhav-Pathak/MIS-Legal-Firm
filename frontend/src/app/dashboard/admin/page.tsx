"use client";
import React, { useState, useEffect } from "react";

import AddUserModal from "@/components/AddUserModal";
import { getCompanies } from "@/utils/API";

import Loading from "@/components/UI/Loading";
import Toast from "@/components/UI/Toast";
import Collapse from "@/components/UI/Collapse";

const AdminPage = () => {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token") as string;

  useEffect(() => {
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
      <section className="flex flex-wrap items-center justify-between p-4">
        <h1 className="text-4xl font-bold">Welcome</h1>
        <button className="btn btn-primary" onClick={()=>window.create_user.showModal()} > Create Client + </button>
      </section>
      <section className="mt-8 flex flex-col gap-4 p-8">
        <h2 className="text-2xl font-bold mb-4">Clients -</h2>
        {loading ? <Loading /> : clients.length > 0 ? (
          clients.map((client, index) => (
            <Collapse header={
              <div className="flex flex-row justify-between">
                <h3>{client.company}</h3>
                <div>
                  <button className="btn btn-primary btn-sm mr-4">Created On
                    <div className="badge">{new Date(client.createdAt).toDateString()}</div>
                  </button>
                  <button className="btn btn-primary btn-sm">Last Updated
                    <div className="badge">{new Date(client.updatedAt).toDateString()}</div>
                  </button>
                </div>
              </div>
            } key={index}>

              <div className="flex flex-col w-full lg:flex-row">
                <div className="grid card place-items-center">
                  <div className="card w-96 bg-base-100 shadow-xl">
                    <div className="card-body">
                      <h2 className="card-title mb-4">Client WorkBook <div className="badge badge-primary">{client.sizeInBytes}&nbsp;KB</div></h2>
                      <span>Updated On- <div className="badge badge-primary">{new Date(client.filelastUpdatedOn).toDateString()}</div></span>
                      <span>Created On- <div className="badge badge-primary">{new Date(client.fileCreatedOn).toDateString()}</div></span>
                      <div className="card-actions justify-end">
                        <button className="btn btn-primary">Open</button>
                      </div>
                    </div>
                  </div>
                </div> 
                <div className="divider lg:divider-horizontal">PDFs</div> 
                <div className="grid flex-grow card bg-base-300 rounded-box place-items-center">
                  {client.pdfTemplates.map((pdfTemplate, index) => (
                    <Collapse header={pdfTemplate.name} key={index}>{/*PdfTemplate Description*/}</Collapse>
                  ))}
                  <button className="btn btn-primary">+ New PDF Template</button>
                </div>
              </div>          
            </Collapse>
          ))) : <p>No clients found.</p>
        }
      </section>
      <Toast />
    </>
  );
};

export default AdminPage;
