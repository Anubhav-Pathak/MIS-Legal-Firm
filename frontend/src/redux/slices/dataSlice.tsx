import {createSlice} from "@reduxjs/toolkit";

import { postRead } from "@/utils/API";
import { toastActions } from "./uiSlice";

const initialState = {
    data: null,
    pages: 1,
    limit: 15,
    isLoading: false,
    error: null,
};

const dataSlice = createSlice({
    name: "data",
    initialState,
    reducers: {
        changeData: (state, action) => {
            state.data = action.payload;
        },
        changePage: (state, action) => {
            state.pages = action.payload;
        },
        changeLimit: (state, action) => {
            state.limit = action.payload;
        }
    }
});

export const fetchData = (page: number, limit: number, token: string) => {
    return async (dispatch: any) => {
        try{
            const response =  await postRead(page, limit, token);
            if (!response.ok) throw new Error("Fetch Failed");
            const data = await response.json();
            console.log(data);
            dispatch(dataActions.changeData(data));
        }catch (error: any){
            dispatch(toastActions.showToast({message: error.message, type: "error"}));
        }
    }
}

export const dataActions = dataSlice.actions;
export default dataSlice.reducer;