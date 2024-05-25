import { createSlice } from "@reduxjs/toolkit"

const userSlice = createSlice({
    name: "user",
    initialState: {
        currentUser: null,
        isFetching: false,
        error: false,
        isLogging: false
    },
    reducers: {
        registerStart: (state) => {
            state.isFetching = true
        },
        registerSuccess: (state, action) => {
            state.isFetching = false,
            state.currentUser = action.payload,
            state.isLogging = false
        },
        registerFailure: (state) => {
            state.isFetching = false,
            state.error = true
        },
        verifiedStarted: (state) => {
            state.isFetching = true
        },
        verifiedSuccess: (state, action) => {
            state.isFetching = false,
            state.currentUser = action.payload,
            state.isLogging = true
        },
        verifiedFailure: (state) => {
            state.isFetching = false,
            state.error = true
        },
        logout:(state,action)=>{
            state.currentUser = action.payload,
            state.isLogging = false
        }
    }
})

export const { registerStart, registerSuccess, registerFailure,verifiedStarted,verifiedSuccess,verifiedFailure,logout } = userSlice.actions

export default userSlice.reducer