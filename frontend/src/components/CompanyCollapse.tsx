import React from 'react'
import Link from 'next/link'

import Collapse from './UI/Collapse'

const CollapseHeader = ({client}) => {
    return (
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
    )
}

const CompanyCollapse = ({client}) => {
    const openHandler = () => {
        localStorage.setItem("client", JSON.stringify(client));
        window.open(`/dashboard/${client.company}?admin=true`);
    }
    return (
        <Collapse header={<CollapseHeader client={client}/>}>
            <div className="flex flex-col w-full lg:flex-row">
            <div className="grid card place-items-center">
                <div className="card w-96 bg-base-100 shadow-xl">
                <div className="card-body">
                    <h2 className="card-title mb-4">Client WorkBook <div className="badge badge-primary">{Math.round(client.sizeInBytes/1024)}&nbsp;KB</div></h2>
                    <span>Last Updated On- <div className="badge badge-primary">{new Date(client.fileCreatedOn).toDateString()}</div></span>
                    <div className="card-actions justify-end mt-4">
                    <button className="btn btn-primary" onClick={openHandler}>Open</button>
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
    )
}

export default CompanyCollapse;
