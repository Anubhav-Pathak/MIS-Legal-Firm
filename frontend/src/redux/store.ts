import { configureStore, combineReducers } from "@reduxjs/toolkit";
import rowReducer from "./features/rowSlice";
import { setupListeners } from "@reduxjs/toolkit/dist/query";

const reducer = combineReducers({
  rowReducer,
});

export const store = configureStore({
  reducer
});

setupListeners(store.dispatch);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
