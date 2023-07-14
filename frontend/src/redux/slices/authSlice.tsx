import { login } from "@/utils/API";
import { createSlice } from "@reduxjs/toolkit";
import { toastActions } from "@/redux/slices/uiSlice";

const initialState = {
    user: null,
    token: null,
    isAuthenticated: false,
    isLoading: false,
    error: null,
};

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        login: (state, action) => {
            state.isAuthenticated = true;
            state.user = action.payload;
        },
        logout: (state) => {
            state.isAuthenticated = false;
        }
    }
});
export const sendLogin = (username: string, password: string) => {
    return async (dispatch: any) => {
        try{
            const response = await login(username, password);
            if (!response.ok) throw new Error("Login Failed")
            const data = await response.json();
            dispatch(authActions.login(data.user));
        } catch (error: any){
            dispatch(toastActions.showToast({message: error.message, type: "error"}));
        }
    };
}

export const authActions = authSlice.actions;
export default authSlice.reducer;