import {PayloadAction, ThunkAction, createSlice} from "@reduxjs/toolkit";

import { postRead } from "@/utils/API";
import { toastActions } from "./uiSlice";
import { filter } from "@/utils/Types";

const initialState = {
    data: {headers: [], results: [], remainingData: 0, totalPages: 0, tabs: []},
    pages: 1,
    limit: 15,
    currentTab: undefined,
    search: undefined,
    filters: [] as filter[],
    isLoading: false,
    error: null,
};

const dataSlice = createSlice({
    name: "data",
    initialState,
    reducers: {
        loading: (state, action) =>{
            state.isLoading = action.payload;
        },
        changeData: (state, action) => {
            state.data = action.payload;
        },
        changePage: (state, action) => {
            state.pages = action.payload;
        },
        changeLimit: (state, action) => {
            state.pages = 1;
            state.limit = action.payload;
        },
        changeTab: (state, action) => {
            state.currentTab = action.payload;
        },
        search: (state, action) => {
            state.pages = 1;
            state.search = action.payload;
        },
        addFilter: (state, action) => {
            let updatedFilter: filter[] = state.filters.filter((filter) => filter.label !== action.payload.label);
            state.filters = [...updatedFilter, action.payload];
        },
        removeFilter: (state, action) => {
            state.filters = state.filters.filter((filter) => filter.label !== action.payload);
        }
    }
});

export const fetchData = (
    pages: number, 
    limit: number, 
    currentTab: string | undefined, 
    search: string | undefined = undefined, 
    filters: filter[] | undefined = []): ThunkAction<void, any, unknown, PayloadAction<any>> => {
    return async (dispatch: any) => {
        try{
            dispatch(dataActions.loading(true));
            const response =  await postRead(pages, limit, currentTab, search, filters);
            if (!response.ok) throw new Error("Fetch Failed");
            const data = await response.json();
            dispatch(dataActions.changeData(data));
        }catch (error: any){
            dispatch(toastActions.showToast({message: error.message, type: "error"}));
        }
        finally{
            dispatch(dataActions.loading(false));
        }
    }
}

export const dataActions = dataSlice.actions;
export default dataSlice.reducer;