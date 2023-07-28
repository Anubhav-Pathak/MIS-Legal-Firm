import {createSlice} from "@reduxjs/toolkit";

import { postRead } from "@/utils/API";
import { toastActions } from "./uiSlice";
import { useAppSelector } from "../hooks";

const initialState = {
    data: {headers: [], results: [], remainingData: 0, totalPages: 0, tabs: []},
    isAdmin: false,
    pages: 1,
    limit: 15,
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
            state.limit = action.payload;
        },
        changeAdmin: (state, action) => {
            state.isAdmin = action.payload;
        }
    }
});

export const fetchData = (page: number, limit: number, token: string, admin?: boolean, user?: Object) => {
    return async (dispatch: any) => {
        try{
            dispatch(dataActions.loading(true));
            let response;
            if (user && admin) response = await postRead(page, limit, token, user);
            else response =  await postRead(page, limit, token);
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