import { createSlice } from "@reduxjs/toolkit"

const userSlice = createSlice({
    name: 'User',
    initialState: {
        user: null,
    },
    reducers: {
        setUser: (state, action) => {
            state.user = action.payload;
        },
        logoutUser: (state) => {
            state.user = null;
        },
    },
})

export const { setUser, logoutUser } = userSlice.actions;
export default userSlice.reducer;