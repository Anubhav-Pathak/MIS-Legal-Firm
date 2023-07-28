import {createSlice} from "@reduxjs/toolkit";

const initialState = {
    rows: [],
    modalRow: {}
};

const rowSlice = createSlice({
    name: "row",
    initialState,
    reducers: {
        modalRow: (state, action) => {
            state.modalRow = action.payload;
            window.timeline.showModal();
        },
        selectRows: (state, action) => {
            state.rows.push(action.payload);
        }
    }
});

export const rowActions = rowSlice.actions;
export default rowSlice.reducer;
