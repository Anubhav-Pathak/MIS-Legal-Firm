import DataContext from "@/contexts/DataContext";
import React from "react";

interface IHeaders {
  columns: string[];
}

const Header = ({columns} : IHeaders) => {
  return (
    <tr className="text-neutral">
      {columns.map((column: string) => (
        <th key={column} className="bg-primary rounded-none">{column}</th>
      ))}
    </tr>
  );
};

const Table = () => {
  const dataContext = React.useContext(DataContext)
  const columns = dataContext.data[0] ? Object.keys(dataContext.data[0]) : [];
  return (
    <div className="overflow-x-auto">
      <table className="table table-compact w-full">
        <thead>
          <Header columns={columns} />
        </thead>
        <tbody>
          {dataContext.data.map((row: {}, index: number) => (
            <tr key={index}>
              {Object.values(row).map((column: any, index: number) => (
                index !== 0 ? <td key={index}>{column}</td> : <th key={index}>{column}</th>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
