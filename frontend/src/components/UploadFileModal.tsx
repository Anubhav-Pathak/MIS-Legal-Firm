import React from 'react'
import { useState } from 'react';
import Image from 'next/image';

import { useAppDispatch } from '@/redux/hooks';
import { toastActions } from '@/redux/slices/uiSlice';
import Modal from './UI/Modal';
import FileUpload from './UI/FileUpload';

const UploadFileModal = () => {

  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(false);
  const [clientFile, setClientFile] = useState<File | null>(null);
  
  const submitHandler = async (event: React.FormEvent) => {
      event.preventDefault();
      setLoading(true);
      try{
        const response = await updateFile({clientFile});
        if(!response) throw new Error("Something went wrong");
        else {
          dispatch(toastActions.showToast({message: "File Updated successfully", type: "success"}));
        }
        setClientFile(null);
      } catch(error: any) {
        // For now Displayed Toast message is same for all errors will change it later
        dispatch(toastActions.showToast({message: error.message, type: "error"}));
      }
      finally {
        setLoading(false);
        window.upload_file.close();
      }
    };
  
    const handleClientFileChange = (files: File[]) => {
      if (files.length > 0) {
        setClientFile(files[0]);
      }
    };

    return (
      <Modal id="upload_file" close={()=>window.upload_file.close()}>
        <form onSubmit={submitHandler}>
          <FileUpload label="Client Excel File" onChange={handleClientFileChange} acceptedFormats=".xlsx" required />
          <button type="submit" className="btn btn-primary gap-2" disabled={!clientFile}>
              {loading ? 
              <span className="loading loading-spinner loading-xs"></span> : 
              <span className="text-neutral flex items-center gap-2 text-xl">Upload <Image src="/upload-icon.svg" width={50} height={50} alt="upload" className="h-6 w-6" /></span>}
          </button>
        </form>
      </Modal>
    )
}

export default UploadFileModal