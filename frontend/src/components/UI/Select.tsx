type options = {
  value: string;
  label?: string;
  disabled?: boolean;
};

const Select = ({options, title, ...props}: {options: options[]; title?: string;}) => {
  return (
    <select className="select bg-gray-300 w-full max-w-xs pr-10 focus:outline-none text-black text-[24px] drop-shadow-md">
      {title && 
      (
        <option disabled defaultValue={title}>
          {title}
        </option>
      )}
      {options.map((option, i) => (
        <option value={option.value} disabled={option.disabled} key={i}>
          {option.label || option.value}
        </option>
      ))}
    </select>
  );
};

export default Select;
