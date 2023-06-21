import React from "react";

const Modal = (props) => {
  return (
    <>
      <dialog id={props.id} className="modal" show={true}>
        <div className="modal-box">{props.children}</div>
      </dialog>
    </>
  );
};

export default Modal;
