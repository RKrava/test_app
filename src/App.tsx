import "./App.css";
import {TonConnectButton, useTonWallet} from "@tonconnect/ui-react";
import { Counter } from "./components/Counter";
import { Jetton } from "./components/Jetton";
import { TransferTon } from "./components/TransferTon";
import styled from "styled-components";
import { Button, FlexBoxCol, FlexBoxRow } from "./components/styled/styled";
import { useTonConnect } from "./hooks/useTonConnect";
import { CHAIN } from "@tonconnect/protocol";
import "@twa-dev/sdk";
import {useEffect} from "react";
import {useTelegram} from "./hooks/useTelegram";
import {Login} from "./components/Login";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "./redux/store";
import {setUserData} from "./redux/user/userSlice";
import {Profile} from "./components/Profile";
import {UserApi} from "./api/user.api";

const StyledApp = styled.div`
  background-color: #e8e8e8;
  color: black;

  @media (prefers-color-scheme: dark) {
    background-color: #222;
    color: white;
  }
  min-height: 100vh;
  padding: 20px 20px;
`;

const AppContainer = styled.div`
  max-width: 900px;
  margin: 0 auto;
`;

function App() {
  const wallet = useTonWallet();
  const userSlice = useSelector((state: RootState) => state.user);
  const dispatch = useDispatch();

  const {tgUser} = useTelegram();

  useEffect(() => {
    if (!!wallet?.account.address) {
      UserApi.updateUser(tgUser?.id.toString() ?? '', tgUser?.username ?? '', wallet?.account.address, '').then((r) => {
        dispatch(setUserData({
          userName: tgUser?.username ?? '',
          walletAddress: wallet?.account.address,
          profilePhoto: tgUser?.photo_url ?? '',
          privateChannelId: r.data?.user?.private_channel_id
        }))
      })
    }
  }, [wallet?.account.address])

  return (
    // <StyledApp>
    //   <AppContainer>
    //     <FlexBoxCol>
    //       <FlexBoxRow>
    //         {/*<TonConnectButton />*/}
    //         {/*<Button>*/}
    //         {/*  {network*/}
    //         {/*    ? network === CHAIN.MAINNET*/}
    //         {/*      ? "mainnet"*/}
    //         {/*      : "testnet"*/}
    //         {/*    : "N/A"}*/}
    //         {/*</Button>*/}
    //       </FlexBoxRow>
    //       <Counter />
    //       {/*<TransferTon />*/}
    //       {/*<Jetton />*/}
    //     </FlexBoxCol>
    //   </AppContainer>
    // </StyledApp>
      <StyledApp>
        <AppContainer>
          <Login/>
          {!userSlice.isLoggedIn ? <Login/> : <Profile/>}
        </AppContainer>
      </StyledApp>
  );
}

export default App;
