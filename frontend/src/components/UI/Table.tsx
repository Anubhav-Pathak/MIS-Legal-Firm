import React from "react";
import "./Table.css";

type TableProps = {
  columns: string[];
  data: string[][];
};

const Table: React.FC<TableProps> = ({ columns, data, ...props }) => {
  return (
    <div className="overflow-x-scroll custom-scrollbar">
      <table className="table w-full">
        <thead>
          <tr>
            {columns.map((column, i) => (
              <th
                key={i}
                className="bg-red-800 text-white text-3xl rounded-none"
              >
                {column}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, i) => (
            <tr key={i} className="bg-white text-black text-3xl">
              {row.map((cell, j) => (
                <td key={j} className="rounded-none">
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
