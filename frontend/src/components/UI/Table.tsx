import React from "react";
import style from "../../assets/CSS/table.module.css";

type TableProps = {
  columns: string[];
  data: string[][];
};

const Table: React.FC<TableProps> = ({ columns, data, ...props }) => {
  return (
    <div className={`overflow-x-scroll ${style.custom_scrollbar}`}>
      <table className="table w-full">
        <thead>
          <tr>{
            columns.map((column, i) => (
              <th key={i} className="bg-red-800 text-white text-3xl rounded-none">{column}</th>
            ))
          }</tr>
        </thead>
        <tbody>
          {data.map((row, i) => (
            <tr key={i} className="bg-white text-black">
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
