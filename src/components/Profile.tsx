import { TonConnectButton } from "@tonconnect/ui-react";
import { useTonConnect } from "../hooks/useTonConnect";
import {useSelector} from "react-redux";
import {RootState} from "../redux/store";

export function Profile() {
    const userData = useSelector((state: RootState) => state.user.userData);

    return (
        <div className="Container">
            <img src={userData.profilePhoto} style={{width: '200px'}}/>
            <div>Username: {userData.userName}</div>
            <div>WalletAddress: {userData.walletAddress}</div>
        </div>
    );
}
