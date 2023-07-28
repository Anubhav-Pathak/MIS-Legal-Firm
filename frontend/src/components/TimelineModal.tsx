import React, { use } from "react";
import { useAppSelector } from "@/redux/hooks";

import Modal from "./UI/Modal";
import Timeline from "./UI/Timeline";
import Button from "./UI/Button";

const TimelineModal = () => {
  return (
    <Modal id="timeline" close={()=>window.timeline.close()}>
      <h1 className="font-bold mb-4">Current Progress: </h1>
      <Timeline date={"20/12/2022"}>
        <h1>Header</h1>
        <Button styles="btn-xs btn-primary mt-4">Generate PDF</Button>
      </Timeline>
    </Modal>
  );
};

export default TimelineModal;
