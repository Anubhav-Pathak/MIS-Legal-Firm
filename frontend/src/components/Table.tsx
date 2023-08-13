"use client";
import { Key } from "react";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";

import { rowActions } from "@/redux/slices/rowSlice";

const Header = ({headers}: any) => {
  return (
    <thead className="text-neutral">
      <tr>
        <th className="bg-primary"></th>
        {headers.map((header: string, index: Key) => <td key={index} className="bg-primary">{header}</td>)}
      </tr>
    </thead> 
  );
};

const Body = ({body, headers}: any) => {

  const dispatch = useAppDispatch();
  const isAdmin = useAppSelector((state) => state.authReducer.isAdmin);
  const onSelectHandler = (e: any) => {
    console.log(e.target.parentNode.parentNode.childNodes[0].value);
    // Selection Logic Here
  }
  const onClickHandler = (e: any) => {
    const row = e.target.parentNode.childNodes[0].childNodes[0].value;
    const rowObj = JSON.parse(row);
    dispatch(rowActions.modalRow(rowObj));
  }
  return (
    <tbody>
      {body.map((row:any, index:Key) => 
        <tr key={index} className="hover cursor-pointer">
          <th className="z-10">
            <input type="hidden" name="arbno" value={JSON.stringify(row)} />
            {isAdmin && 
            <label>
              <input type="checkbox" className="checkbox" onFocus={onSelectHandler}/>
            </label>
            }
          </th>
          {headers.map((header:string, index:Key) => header in row ? <td className="border border-black" onClick={onClickHandler} key={index}>{row[header]}</td> : <td className="border border-black" onClick={onClickHandler} key={index}>-</td>)}
        </tr>
      )}
    </tbody>
  )
}

const Table = ({data}: any) => {
  return (
    <div className="overflow-x-auto h-96">
      <table className="table table-zebra table-xs table-pin-rows table-pin-cols ">
        <Header headers={data.headers} />
        <Body body={data.results} headers={data.headers}/>
      </table>
    </div>
  ) 
}

export default Table;

// const TableRow = ({
//   row,
//   rowIndex,
//   lastIndex,
//   onTimeline,
//   isSelected,
//   toggleRow,
//   showCheckboxes,
// }: any) => {
//   const renderColumn = (column: any, index: number) => {
//     if (index !== 0) {
//       return (
//         <td key={index} className="whitespace-nowrap">
//           {column}
//         </td>
//       );
//     } else {
//       return (
//         <td key={index}>
//           {showCheckboxes ? (
//             <input
//               type="checkbox"
//               checked={isSelected}
//               className="checkbox"
//               onChange={() => toggleRow(row)}
//             />
//           ) : (
//             <div
//               className={`dropdown dropdown-hover dropdown-right ${
//                 lastIndex === rowIndex ? "dropdown-end" : ""
//               }`}
//             >
//               <button
//                 className="btn btn-link"
//                 tabIndex={0}
//                 onClick={() => onTimeline(row)}
//               >
//                 {column}
//               </button>
//               <ul className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52 z-50">
//                 <li onClick={() => onTimeline(row)}>
//                   <a>View Timeline</a>
//                 </li>
//               </ul>
//             </div>
//           )}
//         </td>
//       );
//     }
//   };

//   return <tr>{Object.values(row).map(renderColumn)}</tr>;
// };

// const Table = () => {
//   const dataContext = useContext(DataContext);
//   const { results, tabs } = dataContext.data;
//   const company = dataContext.company;
//   const columns = results[0] ? Object.keys(results[0]) : [];
//   const [searchTerms, setSearchTerms] = useState<Record<string, string>>({});
//   const [generatingPDFs, setGeneratingPDFs] = useState(false);
//   const dispatch = useAppDispatch();
//   const selectedRows = useAppSelector((state) => state.rowReducer.selectedRows);
//   console.log({ selectedRows });

//   const handleSearch = (column: string, value: string) => {
//     if (value === "") {
//       const { [column]: _, ...rest } = searchTerms;
//       setSearchTerms(rest);
//     } else {
//       setSearchTerms((prevSearchTerms) => ({
//         ...prevSearchTerms,
//         [column]: value,
//       }));
//     }
//   };

//   const filterData = useMemo(() => {
//     return results.filter((row) => {
//       if (Object.keys(searchTerms).length === 0) return true;
//       for (const column in searchTerms) {
//         const searchTerm = searchTerms[column];
//         if (
//           searchTerm &&
//           String(row[column]).toLowerCase().includes(searchTerm.toLowerCase())
//         ) {
//           return true;
//         }
//       }
//       return false;
//     });
//   }, [results, searchTerms]);

//   const handleTimeline = (row: any) => {
//     console.log({ row });
//     const dateRow: TimelineEntry = Object.entries(row).filter((i) =>
//       String(i[1]).match(/^\d{2}\.\d{2}\.\d{4}$/)
//     ) as TimelineEntry;
//     dataContext.setTimeline(dateRow || []);
//   };

//   useEffect(() => {
//     if (dataContext.loading) {
//       setSearchTerms({});
//     }
//   }, [dataContext.loading]);

//   const handleTabChange = (tab: string) => {
//     dataContext.setCompany((prevState: { name: string; tab: string }) => ({
//       ...prevState,
//       tab: tab,
//     }));
//   };

//   const toggleRow = (row: number) => {
//     dispatch(toggleRowSelection(row));
//     console.log({ selectedRows });
//   };

//   if (dataContext.loading) {
//     return <Loading />;
//   }

//   if (!results.length) {
//     return <TableError error="No data found" />;
//   }

//   return (
//     <div>
//       <div className="tabs tabs-boxed">
//         {tabs.map((tab: string, index: number) => (
//           <a
//             key={index}
//             className={`tab ${tab === company.tab ? "tab-active" : ""}`}
//             onClick={() => handleTabChange(tab)}
//           >
//             {tab}
//           </a>
//         ))}
//       </div>
//       <div className="overflow-x-auto">
//         <table className="table bg-white w-full text-center align-middle items-center">
//           <thead>
//             <Header columns={columns} onSearch={handleSearch} />
//           </thead>
//           <tbody>
//             {filterData.map((row: any, index: number, arr: any[]) => (
//               <TableRow
//                 key={index}
//                 row={row}
//                 rowIndex={index}
//                 lastIndex={arr.length - 1}
//                 onTimeline={handleTimeline}
//                 isSelected={selectedRows.includes(row)}
//                 toggleRow={toggleRow}
//                 showCheckboxes={generatingPDFs}
//               />
//             ))}
//           </tbody>
//         </table>
//       </div>
//       {generatingPDFs && (
//         <div className="mt-4">
//           <Link href={`/dashboard/${company.name}/pdf`}>
//             <Button>Submit</Button>
//           </Link>
//         </div>
//       )}
//       {!generatingPDFs && (
//         <div className="mt-4">
//           <Button clickHandler={() => setGeneratingPDFs(true)}>
//             Generate PDFs
//           </Button>
//         </div>
//       )}
//     </div>
//   );
// };

// export default Table;
