"use client"
import React from "react";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

import { useAppDispatch } from "@/redux/hooks";
import { toastActions } from "@/redux/slices/uiSlice";

const Toast = (props: any) => {
  const dispatch = useAppDispatch();
  const {show, message, type} = useSelector((state: any) => state.toastReducer);
  const [progressValue, setProgressValue] = useState(100);
  const handleClose = () => {
    dispatch(toastActions.hideToast());
  }
  useEffect(() => {
    let timeout: NodeJS.Timeout;
    let interval: NodeJS.Timeout;

    if (show) {
      let progress = 100;
      setProgressValue(progress);
      timeout = setTimeout(() => {handleClose();}, 5000);
      interval = setInterval(() => {
        progress -= 1;
        setProgressValue(progress);
      }, 50);
    }
    return () => {
      clearTimeout(timeout);
      clearInterval(interval);
    };
  }, [show]);

  return (
    <>
      {show && (
        <div className="toast toast-bottom toast-start" onClick={handleClose}>
          <div className={`alert alert-${type} flex flex-col justify-start`}>
            {console.log(`alert alert-${type} flex flex-col justify-start`)}
            <div className="font-bold uppercase">{message}</div>
            {props.children}
            <progress className="progress progress-white w-56" value={progressValue} max="100"></progress>
          </div>
        </div>
      )}
    </>
  );
};

export default Toast;
