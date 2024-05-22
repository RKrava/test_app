import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import {UserDataType} from "../../types/types";

export interface UserState {
    isLoggedIn: boolean
    isNewUser: {
        isNew: boolean,
        referralInviter: string | null
    },
    userData: UserDataType
}

const initialState: UserState = {
    isNewUser: {
        isNew: false,
        referralInviter: null
    },
    isLoggedIn: false,
    userData: {
        userName: '',
        walletAddress: '',
        profilePhoto: ''
    }
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
