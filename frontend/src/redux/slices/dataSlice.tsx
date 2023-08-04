import {PayloadAction, ThunkAction, createSlice} from "@reduxjs/toolkit";

import { postRead } from "@/utils/API";
import { toastActions } from "./uiSlice";
import { useAppSelector } from "../hooks";

const initialState = {
    data: {headers: [], results: [], remainingData: 0, totalPages: 0, tabs: []},
    pages: 1,
    limit: 15,
    currentTab: undefined,
    search: undefined,
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
            state.search = action.payload;
        }
    }
});

export const fetchData = (pages: number, limit: number, currentTab: string | undefined, search: string | undefined = undefined): ThunkAction<void, any, unknown, PayloadAction<any>> => {
    return async (dispatch: any) => {
        try{
            dispatch(dataActions.loading(true));
            const response =  await postRead(pages, limit, currentTab, search);
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