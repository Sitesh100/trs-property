import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    token: "",
    user: "",
};

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        setToken: (state, action) => {
            state.token = action.payload;
        },
        setUser: (state, action) => {
            state.user = action.payload;
        },
        clearAuth: (state) => {
            state.token = "";
            state.user = "";
        },
    },
});

export const { setToken, setUser, clearAuth } = authSlice.actions;
export default authSlice.reducer;
