import { login } from "@/utils/API";
import { createSlice } from "@reduxjs/toolkit";
import { toastActions } from "@/redux/slices/uiSlice";

import { redirect } from "next/navigation";

const initialState = {
  company: null,
  isAuthenticated: false,
  token: "",
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login: (state, action) => {
      state.isAuthenticated = true;
      state.company = action.payload;
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.company = null;
    },
    setToken: (state, action) => {
      state.token = action.payload;
    }
  },
});
export const sendLogin = (username: string, password: string, isAdmin: boolean) => {
  return async (dispatch: any) => {
    try {
      const response = await login(username, password, isAdmin);
      if (!response.ok) throw new Error("Invalid credentials");
      const data = await response.json();
      localStorage.setItem("token", data.token);
      dispatch(authActions.login(data.company));
    } catch (error: any) {
      dispatch(
        toastActions.showToast({ message: error.message, type: "error" })
      );
    }
  };
};

export const sendLogout = () => {
  return async (dispatch: any) => {
    try {
      localStorage.clear();
      dispatch(authActions.logout());
    } catch (error: any) {
      console.log({ error });
      dispatch(
        toastActions.showToast({ message: error.message, type: "error" })
      );
    }
  };
};

export const authActions = authSlice.actions;
export default authSlice.reducer;
