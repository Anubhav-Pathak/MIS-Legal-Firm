import { configureStore, combineReducers } from "@reduxjs/toolkit";
import rowReducer from "./slices/rowSlice";
import { toastReducer } from "./slices/uiSlice";
import { setupListeners } from "@reduxjs/toolkit/dist/query";

const reducer = combineReducers({
  rowReducer,
  toastReducer,
});

export const store = configureStore({reducer});

setupListeners(store.dispatch);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;