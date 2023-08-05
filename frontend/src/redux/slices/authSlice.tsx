import { login, verify } from "@/utils/API";
import { ThunkAction, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { toastActions } from "@/redux/slices/uiSlice";

const initialState = {
  company: null,
  isAuthenticated: false,
  token: "",
  isAdmin: false,
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
    },
    setIsAdmin: (state, action) => {
      state.isAdmin = action.payload;
    }
  },
});
export const sendLogin = (username: string, password: string, isAdmin: boolean, bypass: boolean | undefined) => {
  return async (dispatch: any) => {
    try {
      const response = await login(username, password, isAdmin, bypass);
      if (!response.ok) throw new Error("Invalid credentials");
      const data = await response.json();
      bypass ? localStorage.setItem("client", data.token) : localStorage.setItem("token", data.token);
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
      dispatch(
        toastActions.showToast({ message: error.message, type: "error" })
      );
    }
  };
};

export const verifyToken = (token: string): ThunkAction<void, any, unknown, PayloadAction<any>> => {
  return async (dispatch: any) => {
    try {
      const response = await verify(token);
      if (!response.ok) throw new Error("Invalid token");
      const data = await response.json();
      dispatch(authActions.setIsAdmin(data.isAuthenticated));
    } catch (error: any) {
      dispatch(
        toastActions.showToast({ message: error.message, type: "error" })
      );
    }
  };
}

export const authActions = authSlice.actions;
export default authSlice.reducer;
