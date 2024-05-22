import { TonConnectButton } from "@tonconnect/ui-react";
import { useTonConnect } from "../hooks/useTonConnect";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../redux/store";

export function Login() {
    return (
    <div className="Container">
        <TonConnectButton />
    </div>
);
}
