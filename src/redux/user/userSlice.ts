import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import {UserDataType} from "../../types/types";

export interface UserState {
    isLoggedIn: boolean
    userData: UserDataType,
}

const initialState: UserState = {
    isLoggedIn: false,
    userData: {
        userName: '',
        walletAddress: '',
        profilePhoto: '',
        privateChannelId: ''
    },

}

export const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setUserData: (state: UserState, action: PayloadAction<UserDataType>) => {
            state.userData = action.payload
            state.isLoggedIn = true
        },
    }
})

// Action creators are generated for each case reducer function
export const {
    setUserData
} = userSlice.actions

export default userSlice.reducer