import {TonConnectButton, useTonWallet} from "@tonconnect/ui-react";
import { useTonConnect } from "../hooks/useTonConnect";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../redux/store";
import {useTelegram} from "../hooks/useTelegram";
import {useEffect, useState} from "react";
import {UserApi} from "../api/user.api";
import {setKeys, setUserData} from "../redux/user/userSlice";
import {updateConnectedChannels} from "../redux/user/userDataThunk";
import {UserType, KeyType, ConnectedChannelType} from "../types/types";

export function Profile() {
    const {tg, tgUser} = useTelegram();
    const dispatch = useDispatch<any>()
    const wallet = useTonWallet();
    const userData = useSelector((state: RootState) => state.user.userData);
    const connectedChannels = useSelector((state: RootState) => state.user.connectedChannels);
    const keys = useSelector((state: RootState) => state.user.keys);
    const [users, setUsers] = useState([] as Array<UserType>)


    const processKeys = async (response: Array<KeyType>) => {

        const countMap: { [key: string]: { wallet_address_buyer: string, wallet_address_owner: string, number: number } } = {};

        response.forEach((item: KeyType) => {
            const key = item.wallet_address_buyer+item.wallet_address_owner;
            if (countMap[key]) {
                countMap[key].number++;
            } else {
                countMap[key] = {
                    wallet_address_buyer: item.wallet_address_buyer,
                    wallet_address_owner: item.wallet_address_owner,
                    number: 1
                };
            }
        });
        const newKeys = Object.values(countMap);

        const data = newKeys.map((item) => {
            const owner = users.find((user: any) => item.wallet_address_owner === user.walletAddress);
            if (!owner) {
                return null;
            }
            const channel = connectedChannels.find((cc) => cc.channel_id === owner.privateChannelId);
            if (!channel) {
                return null;
            }
            const result: KeyType = {
                channelTitle: channel.title, inviteLink: channel.invite_link, number: item.number,
                wallet_address_owner: item.wallet_address_owner, wallet_address_buyer: item.wallet_address_buyer
            }
            return result;
        })

        const notNullData: Array<KeyType> = data.filter((item): item is KeyType => item !== null);
        return notNullData
    }

    const updatePrivateChannelId = (channel_id: string) => {
        UserApi.updateUser(tgUser?.id.toString() ?? '', tgUser?.username ?? '', wallet?.account?.address ?? '', channel_id)
            .then(r =>
            {
                dispatch(setUserData({...userData, privateChannelId: channel_id}))
            })
    }

    const updateUsers = () => {
        UserApi.getUsers().then((response) => {
            const newUsers = response.map((item: any) =>  {
                return {
                    userName: item.username,
                    walletAddress: item.wallet_address,
                    telegramId: item.telegram_id,
                    privateChannelId: item.private_channel_id
                }
            })
            setUsers(newUsers)
        })
    }

    const updateKeys = () => {
        UserApi.getKeys().then(async (response) => {
            const processedKeys = await processKeys(response)
            dispatch(setKeys(processedKeys))
        })
    }


    useEffect(() => {
        updateUsers()
        dispatch(updateConnectedChannels())
    }, [])

    useEffect(() => {
        updateKeys()
    }, [connectedChannels, users])

    return (
        <div className="Container">
            <div>Username: {userData.userName}</div>
            <div>WalletAddress: {userData.walletAddress}</div>
            <div>
                <div><button onClick={() => tg.openTelegramLink('https://t.me/talkiefi1_bot?startchannel=true&admin=invite_users+restrict_members')}>Add bot</button></div>
                <p>Private channel: </p>
                <div>
                    {/*// 5810989802 penguin 323693764 krava*/}
                    {/*{connectedChannels?.filter((item) => item.telegram_id == tgUser?.id.toString()).map((item: ConnectedChannelType) => {*/}
                        {connectedChannels?.filter((item) => item.telegram_id == '323693764').map((item: ConnectedChannelType) => {
                        return <>

                            <p>  <img src={item?.photo} style={{width: '35px', borderRadius: '50px'}}/> {item?.title} {userData.privateChannelId == item.channel_id
                            ? <button disabled>Selected</button>
                            : <button onClick={() => updatePrivateChannelId(item.channel_id)}>Select</button>}</p>
                        </>
                    })}
                </div>
            </div>

            <div>
                <p>My clubs</p>
                <div>
                    {keys.filter((item) => item.wallet_address_buyer === wallet?.account?.address).map((item: KeyType) => {
                        return <p>{item.channelTitle} Keys: {item.number} <a href={item.inviteLink}>Channel</a> </p>
                    })}
                </div>
            </div>

            <div>
                <p>All clubs</p>
                <div>
                    {users?.map((item: any) => {
                        if (item.privateChannelId && wallet?.account?.address) {
                            const channel = connectedChannels.find((cc) => cc.channel_id == item.privateChannelId)
                            console.log(connectedChannels)
                            return <p> {channel?.title}
                                <button onClick={() => {UserApi.buyKey(wallet?.account?.address, item.walletAddress).then((r) => {
                                    console.log(r)
                                    updateKeys()
                                })}}>Buy</button>
                                <button onClick={() => {UserApi.sellKey(wallet?.account?.address, item.walletAddress).then((r) => {
                                    updateKeys()
                                })}}>Sell</button>
                            </p>
                        }
                    })}
                </div>
            </div>
        </div>
    );
}
