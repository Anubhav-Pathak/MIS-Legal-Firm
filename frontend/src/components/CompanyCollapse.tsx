import React from 'react'

import Collapse from './UI/Collapse'
import Button from './UI/Button'
import { deleteClient } from '@/utils/API'
import { toastActions } from '@/redux/slices/uiSlice'
import { useAppDispatch, useAppSelector } from '@/redux/hooks'

import { ClientProps } from '@/utils/Types'

const CollapseHeader = ({client}: ClientProps) => {
    const dispatch = useAppDispatch();
    const token = useAppSelector((state) => state.authReducer.token);
    const onDeleteHandler = async () => {
        window.confirm(`Are you sure you want to delete ${client.company}?`) && (
            await deleteClient(client._id, token)
            .then((result) => {
                // window.location.reload();
                dispatch(toastActions.showToast({ message: result.message, type: "success" }));
            })
            .catch(error => {
                dispatch(toastActions.showToast({ message: error.message, type: "error" }));
            })
        )
    }
    return (
        <div className="flex flex-row justify-between items-center">
            <h3>{client.company}</h3>
            <div className='flex items-center gap-2'>
                <button className="btn btn-primary btn-sm">Created On
                    <div className="badge">{new Date(client.createdAt).toDateString()}</div>
                </button>
                <Button clickHandler={onDeleteHandler} styles="btn-sm"><img src="/delete-icon.svg" alt="Delete" /></Button>
            </div>
        </div>
    )
}

const CompanyCollapse = ({client}:ClientProps) => {
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
                    <span className='text-xs'>Last Updated On- {new Date(client.fileUpdatedOn).toDateString()}</span>
                    <h2 className="card-title mb-4">Client WorkBook <div className="badge badge-primary">{Math.round(client.fileSizeInKB)}&nbsp;KB</div></h2>
                    <div className="card-actions justify-end">
                    <button className="btn btn-primary" onClick={openHandler}>Open</button>
                    </div>
                </div>
                </div>
            </div> 
            <div className="divider lg:divider-horizontal">PDFs</div> 
            <div className="grid flex-grow card bg-base-300 rounded-box place-items-center">
                {client.pdfTemplates?.map((pdfTemplate, index) => (
                    <Collapse header={pdfTemplate} key={index}>{/*PdfTemplate Description*/}</Collapse>
                ))}
                <button className="btn btn-primary">+ New PDF Template</button>
            </div>
            </div>          
        </Collapse>
    )
}

export default CompanyCollapse;
