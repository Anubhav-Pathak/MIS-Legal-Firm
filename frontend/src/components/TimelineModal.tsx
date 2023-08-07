import React from "react";
import { useAppSelector } from "@/redux/hooks";
import { Key } from "react";

import Modal from "./UI/Modal";
import Timeline from "./UI/Timeline";

const TimelineModal = () => {
  const modalRow: any = useAppSelector((state) => state.rowReducer.modalRow);

  const filteredRow: Array<Object> = [];

  Object.keys(modalRow).filter((column) => {
    const date = modalRow[column];
    if (String(date).match(/^\d{2}[-.]\d{2}[-.]\d{4}$/)) {
      filteredRow.push({ column, date });
    }
  });

  return (
    <Modal id="timeline" close={() => window.timeline.close()}>
      <h6 className="text-xs">Arbitration Number: {modalRow["ARB NO"]}</h6>
      <h1 className="text-lg font-bold mb-4">
        Current Status: {modalRow["CURRENT STATUS"]}
      </h1>
      {filteredRow.map((row: any, index: Key) => {
        return (
          <Timeline date={row.date} key={index}>
            <h1>{row.column}</h1>
          </Timeline>
        );
      })}
    </Modal>
  );
};

export default TimelineModal;
