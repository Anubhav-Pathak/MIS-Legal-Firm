"use client"
import React from "react";
import { useEffect, useState } from "react";

const Toast = (props: any) => {
  const [progressValue, setProgressValue] = useState(100);

  const handleClose = () => {
    props.onCloseHandler();
  };

  useEffect(() => {
    let timeout: NodeJS.Timeout;
    let interval: NodeJS.Timeout;

    if (props.show) {
      let progress = 100;
      setProgressValue(progress);

      timeout = setTimeout(() => {
        handleClose();
      }, 5000);

      interval = setInterval(() => {
        progress -= 1;
        setProgressValue(progress);
      }, 50);
    }

    return () => {
      clearTimeout(timeout);
      clearInterval(interval);
    };
  }, [props.show]);

  return (
    <>
      {props.show && (
        <div className="toast toast-top toast-end" onClick={handleClose}>
          <div
            className={`alert ${props.styles} shadow-lg flex flex-col cursor-pointer`}
          >
            {props.message && (
              <div className="font-bold uppercase">{props.message}</div>
            )}
            {props.children}
            <progress
              className="progress progress-white w-56"
              value={progressValue}
              max="100"
            ></progress>
          </div>
        </div>
      )}
    </>
  );
};

export default Toast;
