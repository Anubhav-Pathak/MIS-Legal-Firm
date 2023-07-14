import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/dist/query";

import rowReducer from "./slices/rowSlice";
import { toastReducer } from "./slices/uiSlice";
import authReducer from "./slices/authSlice";

const reducer = combineReducers({
  authReducer,
  rowReducer,
  toastReducer,
});

export const store = configureStore({reducer});

setupListeners(store.dispatch);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;