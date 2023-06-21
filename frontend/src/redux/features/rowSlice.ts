import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type Row = {
  id: number;
  data: string;
};

type RowState = {
  rows: Row[];
  selectedRows: number[];
};

const initialState: RowState = {
  rows: [],
  selectedRows: [],
};

const rowSlice = createSlice({
  name: "row",
  initialState,
  reducers: {
    addRow: (state, action: PayloadAction<Row>) => {
      state.rows.push(action.payload);
    },
    removeRow: (state, action: PayloadAction<number>) => {
      state.rows = state.rows.filter((row) => row.id !== action.payload);
      state.selectedRows = state.selectedRows.filter(
        (id) => id !== action.payload
      );
    },
    toggleRowSelection: (state, action: PayloadAction<number>) => {
      const index = state.selectedRows.indexOf(action.payload);
      if (index !== -1) {
        state.selectedRows.splice(index, 1);
      } else {
        state.selectedRows.push(action.payload);
      }
    },
    clearRowSelection: (state) => {
      state.selectedRows = [];
    },
  },
});

export const { addRow, removeRow, toggleRowSelection, clearRowSelection } =
  rowSlice.actions;

export default rowSlice.reducer;
