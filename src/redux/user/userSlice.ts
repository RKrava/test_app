import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import {ConnectedChannelType, KeyType, UserDataType} from "../../types/types";

export interface UserState {
    isLoggedIn: boolean
    userData: UserDataType,
    connectedChannels: Array<ConnectedChannelType>,
    keys: Array<KeyType>
}

const initialState: UserState = {
    isLoggedIn: false,
    userData: {
        userName: '',
        walletAddress: '',
        profilePhoto: '',
        privateChannelId: '',

    },
    connectedChannels: [],
    keys: [],
}

export const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setUserData: (state: UserState, action: PayloadAction<UserDataType>) => {
            state.userData = action.payload
            state.isLoggedIn = true
        },
        setConnectedChannels: (state: UserState, action: PayloadAction<Array<ConnectedChannelType>>) => {
            state.connectedChannels = action.payload
        },
        setKeys: (state: UserState, action: PayloadAction<Array<KeyType>>) => {
            state.keys = action.payload
        },
    }
})

// Action creators are generated for each case reducer function
export const {
    setUserData,
    setConnectedChannels,
    setKeys
} = userSlice.actions

export default userSlice.reducer
