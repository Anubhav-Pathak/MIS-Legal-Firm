import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/dist/query";

import { toastReducer } from "./slices/uiSlice";
import authReducer from "./slices/authSlice";
import dataReducer from "./slices/dataSlice";
import rowReducer from "./slices/rowSlice";
import filterReducer from "./slices/filterSlice";

const reducer = combineReducers({
  authReducer,
  toastReducer,
  dataReducer,
  rowReducer,
  filterReducer
});

export const store = configureStore({reducer});

setupListeners(store.dispatch);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;