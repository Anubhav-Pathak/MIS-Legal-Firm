import { createSlice } from "@reduxjs/toolkit";

const toastSlice = createSlice({
    name: "toast",
    initialState: {
        show: false,
        type: "",
        message: "",
    },
    reducers: {
        showToast: (state, action) => {
            state.show = true;
            state.type = action.payload.type;
            state.message = action.payload.message;
        },
        hideToast: (state) => {
            state.show = false;
            state.type = "";
            state.message = "";
        }
    }
});

export const toastActions = toastSlice.actions;

export const toastReducer =  toastSlice.reducer;