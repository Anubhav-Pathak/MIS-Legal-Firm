import React, {useContext} from "react";
import DataContext from "@/contexts/DataContext";

const Select = ({options, label}: {options: string[], label: string}) => {

  const dataContext = useContext(DataContext);

  function onChangeHandler(e: React.ChangeEvent<HTMLSelectElement>) {
    dataContext.filterHandler({column: label, value: e.target.value});
  }

  return (
    <select className="select bg-secondary w-full max-w-xs" defaultValue={label} onChange={onChangeHandler}>
      <option value={label} disabled>Choose a {label}</option>
      {options.map((option, i) => (
        <option value={option} key={i}>{option}</option>
      ))}
    </select>
  );
};

export default Select;
