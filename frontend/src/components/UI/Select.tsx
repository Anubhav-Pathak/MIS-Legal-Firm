import React, { Key } from "react";

const Select = React.forwardRef((props: any, ref: any) => {
  const onChangeHandler = (e: any) => {
    props.changeHandler(e.target.value);
  };
  return (
    <select className="select select-bordered select-primary select-sm w-full max-w-xs" ref={ref} onChange={onChangeHandler}>
      <option disabled value={"Select The Type"}>Select the {props.label}</option>
      {props.options.map((option: string, index: Key) => (
        <option key={index}>{option}</option>
      ))}
    </select>
  )
});

export default Select;
