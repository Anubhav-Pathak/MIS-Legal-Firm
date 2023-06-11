import React, { useContext, useState } from "react";
import DataContext from "@/contexts/DataContext";
import Button from "./Button";

interface SelectProps {
  options: string[];
  label: string;
  showButton?: boolean;
  buttonLabel?: string;
  onButtonClick?: () => void;
  resetSelect?: boolean;
}

const Select = ({
  options,
  label,
  showButton = false,
  buttonLabel = "Reset",
  onButtonClick,
  resetSelect = false,
}: SelectProps) => {
  const dataContext = useContext(DataContext);
  const [selectedOption, setSelectedOption] = useState("");

  function onChangeHandler(e: React.ChangeEvent<HTMLSelectElement>) {
    const value = e.target.value;
    setSelectedOption(value);
    dataContext.filterHandler({
      column: label,
      value: value,
    });
  }

  function handleButtonClick() {
    if (resetSelect) {
      setSelectedOption("");
    }
    if (onButtonClick) {
      onButtonClick();
    }
  }

  return (
    <div className="input-group">
      <select
        className="select bg-secondary w-full max-w-xs"
        value={selectedOption}
        onChange={onChangeHandler}
      >
        <option value="" disabled>
          Choose a {label}
        </option>
        {options.map((option, i) => (
          <option value={option} key={i}>
            {option}
          </option>
        ))}
      </select>
      {showButton && (
        <Button
          type="button"
          clickHandler={handleButtonClick}
          styles="btn btn-primary btn-outline"
        >
          {buttonLabel}
        </Button>
      )}
    </div>
  );
};

export default Select;
