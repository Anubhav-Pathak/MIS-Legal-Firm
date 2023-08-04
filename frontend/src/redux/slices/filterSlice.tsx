import {PayloadAction, ThunkAction, createSlice} from "@reduxjs/toolkit";

import { getFilter, postRead } from "@/utils/API";
import { toastActions } from "./uiSlice";
import { filter } from "@/utils/Types";

const initialState = {
    filter: [] as filter[],
    loading: false
};

const filterSlice = createSlice({
    name: "filter",
    initialState,
    reducers: {
        addFilter: (state, action: PayloadAction<filter>) => {
            const updatedFilter: filter[] = [...state.filter, action.payload];
            state.filter = updatedFilter;
        },
        removeFilter: (state, action: PayloadAction<string>) => {
            const updatedFilter: filter[] = state.filter.filter((filter) => filter.label !== action.payload);
            state.filter = updatedFilter;
        },
        loading: (state, action: PayloadAction<boolean>) => {
            state.loading = action.payload;
        }
    }
});

export const addFilter = (filter: string, token: string): ThunkAction<void, any, unknown, PayloadAction<any>> => {
    return async (dispatch) => {
        try {
            dispatch(filterActions.loading(true));
            const data = await getFilter(filter, token);
            dispatch(filterActions.addFilter({label: filter, options: data.uniqueValues}));
        } catch (error) {
            dispatch(toastActions.showToast({message: "Filter could not be added", type: "error"}));
        }
        finally {
            dispatch(filterActions.loading(false));
            window.add_filter.close();
        }
    }
}

export const filterActions = filterSlice.actions;
export default filterSlice.reducer;