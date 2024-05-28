import { AppThunk } from '../store'
import {UserApi} from "../../api/user.api";
import {setConnectedChannels, setUserData} from "./userSlice";
import {Wallet, WalletInfoWithOpenMethod} from "@tonconnect/ui-react";
import {useTelegram} from "../../hooks/useTelegram";

export const updateUserDataThunk = (wallet: Wallet | (Wallet & WalletInfoWithOpenMethod) | null,
                                    tgUser: WebAppUser | undefined): AppThunk => async (dispatch, getState) => {
    try {
        if (!!wallet?.account.address) {
            await UserApi.updateUser(tgUser?.id.toString() ?? '', tgUser?.username ?? '', wallet?.account.address, '').then((r) => {
                dispatch(setUserData({
                    userName: tgUser?.username ?? '',
                    walletAddress: wallet?.account.address,
                    profilePhoto: tgUser?.photo_url ?? '',
                    privateChannelId: r?.user?.private_channel_id
                }))
            })
        }
    } catch (error) {
        const errorMessage = 'Unable to update userdata. Please reload the page'
        console.log(errorMessage)
    }
}

export const updateConnectedChannels = (): AppThunk => async (dispatch, getState) => {
    try {
        const {tgUser} = useTelegram();

        // if (!tgUser) {
        //     return
        // }

        UserApi.getConnectedChannels().then(async r => {
            if (Array.isArray(r)) {
                dispatch(setConnectedChannels(r))
            }
        })
    } catch (error) {
        const errorMessage = 'Unable to update connected channels. Please reload the page'
        console.log(errorMessage)
    }
}
