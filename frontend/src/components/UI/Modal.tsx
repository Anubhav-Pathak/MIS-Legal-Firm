import React from "react";

const Modal = (props: any) => {
  return (
    <>
      <input
        type="checkbox"
        id="my-modal-4"
        className="modal-toggle"
        checked={props.show}
        onChange={props.onCloseHandler}
      />
      <label htmlFor="my-modal-4" className="modal cursor-pointer">
        <label className="modal-box relative" htmlFor="">
          {props.children}
        </label>
      </label>
    </>
  );
};

export default Modal;
