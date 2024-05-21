import { TonConnectButton } from "@tonconnect/ui-react";
import { useCounterContract } from "../hooks/useCounterContract";
import { useTonConnect } from "../hooks/useTonConnect";

import {
  Card,
  FlexBoxCol,
  FlexBoxRow,
  Ellipsis,
  Button,
} from "./styled/styled";

export function Counter() {
  const { connected } = useTonConnect();
  const { value, address, sendIncrement } = useCounterContract();

  return (
    <div className="Container">
      <TonConnectButton />

      <Card>
        <FlexBoxCol>
          <h3>Add private channel</h3>
          {/*<FlexBoxRow>*/}
          {/*  <b>Address</b>*/}
          {/*  <Ellipsis>{address}</Ellipsis>*/}
          {/*</FlexBoxRow>*/}
          {/*<FlexBoxRow>*/}
          {/*  <b>Value</b>*/}
          {/*  <div>{value ?? "Loading..."}</div>*/}
          {/*</FlexBoxRow>*/}
          <a href={'https://t.me/talkiefi1_bot?startchannel=start'}>
            {/*<Button*/}
            {/*  disabled={!connected}*/}
            {/*  className={`Button ${connected ? "Active" : "Disabled"}`}*/}
            {/*  onClick={() => {*/}
            {/*    sendIncrement();*/}
            {/*  }}*/}
            {/*>*/}
            {/*  Increment*/}
            {/*</Button>*/}
            add
          </a>
        </FlexBoxCol>
      </Card>
    </div>
  );
}
