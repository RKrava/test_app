import {TonConnectButton, useTonWallet} from "@tonconnect/ui-react";
import { useTonConnect } from "../hooks/useTonConnect";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../redux/store";
import {useTelegram} from "../hooks/useTelegram";
import {useEffect, useState} from "react";
import {UserApi} from "../api/user.api";
import {BotApi} from "../api/chat.api";
import {setUserData} from "../redux/user/userSlice";

export function Profile() {
    const {tg, tgUser} = useTelegram();
    const dispatch = useDispatch()
    const wallet = useTonWallet();
    const userData = useSelector((state: RootState) => state.user.userData);
    const [users, setUsers] = useState([] as any)
    const [keys, setKeys] = useState([] as any)
    const [connectedChannels, setConnectedChannels] = useState([] as any)

    const updateUsers = () => {
        UserApi.getUsers().then((response) => {
            setUsers(response.data)
        })
    }

    const updateKeys = () => {
        UserApi.getKeys().then((response) => {
            setKeys(response.data)
        })
    }

    useEffect(() => {
        updateUsers()
        updateKeys()
        // UserApi.getConnectedChannels(tgUser?.id.toString() ?? '').then(r => {
        //     setConnectedChannels(r.data)
        // })

        UserApi.getConnectedChannels('323693764').then(r => {
            setConnectedChannels(r)
            console.log(r)
        })
    }, [])

    const myChannels = [
        {
            channel_id: '1',
            channel_name: 'Krava'
        },
        {
            channel_id: '2',
            channel_name: 'Penguin'
        }
    ]

    const allChannels = [
        {
            club_id: '1',
            club_name: 'Penguin'
        }
    ]

    const myKeys = [
        {
            channel_id: '1',
            channel_name: 'Penguin',
            number: 1,
            club_link: ''
        }
    ]

    return (
        <div className="Container">
            <div>Username: {userData.userName}</div>
            <div>WalletAddress: {userData.walletAddress}</div>

            <div>
                <div><button onClick={() => tg.openTelegramLink('https://t.me/talkiefi1_bot?startchannel=true&admin=invite_users+restrict_members')}>Add bot</button></div>
                <p>Private channel: </p>
                <div>
                    {connectedChannels?.map((item: any) => {
                        return <p>{item.chatData.title} {userData.privateChannelId === item.channel_id
                            ? <button disabled>Selected</button>
                            : <button onClick={() =>
                            {UserApi.updateUser(tgUser?.id.toString() ?? '', tgUser?.username ?? '', wallet?.account?.address ?? '', item.channel_id)
                                .then(r => {dispatch(setUserData({...userData, privateChannelId: item.channel_id}))})}}>Select</button>}</p>
                    })}
                </div>
            </div>

            <div>
                <p>My clubs</p>
                <div>
                    {myKeys.map((item) => {
                        return <p>{item.channel_name} Keys: {item.number} <a href={item.club_link}>Channel</a> </p>
                    })}
                </div>
            </div>
            <div>
                <p>All clubs</p>
                <div>
                    {allChannels.map((item) => {
                        return <p>{item.club_name} <button>Buy</button> <button>Sell</button></p>
                    })}
                </div>
            </div>
        </div>
    );
}
