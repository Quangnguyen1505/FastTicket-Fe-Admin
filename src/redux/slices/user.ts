// redux/userSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UserState {
    shopId?: string;
    accessToken?: string;
    refreshToken?: string;
}

const initialState: UserState = {
    shopId: '',
    accessToken: '',
    refreshToken: '',
};

const userSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setUser: (state, action: PayloadAction<UserState>) => {
            state.shopId = action.payload.shopId;
            state.accessToken = action.payload.accessToken;
            state.refreshToken = action.payload.refreshToken;
        },
        clearUser: (state) => {
            state.shopId = '';
            state.accessToken = '';
            state.refreshToken = '';
        },
    },
});

export const { setUser, clearUser } = userSlice.actions;
export default userSlice.reducer;
