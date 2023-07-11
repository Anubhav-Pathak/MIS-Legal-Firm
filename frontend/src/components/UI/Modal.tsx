import React from "react";

const Modal = (props: any) => {
  return (
    <dialog className="modal" id={props.id}>
      <div className="modal-box">
        <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2" onClick={()=>props.close()}>✕</button>
        {props.children}
      </div>
    </dialog>
  );
};

export default Modal;
