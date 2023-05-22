import React, {useState} from 'react';
import { postSearch } from "../utils/API"

const DataContext = React.createContext({
  filter: {},
  data: [],
  searchHandler: (search: string)=>{},
});

export const DataContextProvider = (props: any) => {
  const [data, setData] = useState([]);
  const [loader, setLoader] = useState(false);
  const [filter, setFilter] = useState([])

  async function searchHandler(search: string) {
    try{
      const data = await postSearch(search);
      if(!data) throw Error("No data found !");
      setData(data);
    }
    catch (error){
      console.log(error);
    }
  }

  return(
    <DataContext.Provider 
        value={{filter: filter, data: data, searchHandler: searchHandler}}
    >
    {props.children}
    </DataContext.Provider>
  )
}

export default DataContext;