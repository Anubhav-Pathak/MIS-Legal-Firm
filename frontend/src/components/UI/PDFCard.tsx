import React from "react";
import DataContext from "@/contexts/DataContext";
import { useState } from "react";

const PDFCard = (props: any) => {
  const handleCreatePDF = () => {
    props.onButtonClick(props.fileName);
  };

  return (
    <div className="join join-vertical">
      <div className="card bg-base-100 shadow-xl join-item w-80">
        <figure className="p-10 bg-secondary">
          <img
            src="/file-icon.svg"
            alt="pdf"
            className="rounded-xl text-white w-32 h-32"
          />
        </figure>

        <div className="card-body items-center text-center">
          <h2 className="card-title">{props.fileName}</h2>
        </div>
        <button className="btn btn-primary join-item" onClick={handleCreatePDF}>
          Create PDF
        </button>
      </div>
    </div>
  );
};

export default PDFCard;
