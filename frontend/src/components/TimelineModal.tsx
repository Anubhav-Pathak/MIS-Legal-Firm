"use client"
import React from "react";
import Modal from "./UI/Modal";
import Timeline from "./UI/Timeline";
import DataContext from "@/contexts/DataContext";

const TimelineModal = () => {
  const dataContext = React.useContext(DataContext);
  function closeHandler() {
    dataContext.setTimeline([]);
  }

  return (
    <Modal
      show={dataContext.timeline.length ? true : false}
      onCloseHandler={closeHandler}
    >
      <div className="alert bg-[#e5e7eb] mb-8">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          className="stroke-current shrink-0 w-6 h-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          ></path>
        </svg>
        <span className="font-bold text-md">Current Progress:</span>
        <div className="flex flex-col items-center justify-center w-full">
          <div className="bg-white rounded-lg shadow-xl w-full h-auto font-bold text-xl text-center">
            {dataContext.timeline.at(-1)?.[0]}
          </div>
          <div className="bg-white rounded-lg shadow-xl w-1/2 h-auto font-bold text-xl text-center">
            {dataContext.timeline.at(-1)?.[1]}
          </div>
        </div>
      </div>
      <Timeline data={dataContext.timeline}/>
    </Modal>
  );
};

export default TimelineModal;
