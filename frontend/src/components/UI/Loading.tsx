import React from "react";

const Loading = ({ bg = "primary", message = "Loading..." }) => {
  return (
    <div className="alert flex flex-row justify-center animate-pulse">
      <div className={`alert bg-${bg} max-w-5xl text-white`}>
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
        <div className="font-bold uppercase">{message}</div>
        <span className="loading loading-dots loading-lg"></span>
      </div>
    </div>
  );
};

export default Loading;
