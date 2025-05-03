import "../styles/globals.css";
import { ThirdwebProvider } from "thirdweb/react";
import { StateContextProvider } from "../Context/NFTs";
import { client } from "./client";
import { ConnectButton } from "thirdweb/react";

export default function App({ Component, pageProps }) {
  return (
    // clientId="827a31c1ae557627a028cebf1b714bfc" activeChain={Sepolia}
    <ThirdwebProvider>
      <StateContextProvider>
        <ConnectButton client={client} />
        <Component {...pageProps} />
      </StateContextProvider>
    </ThirdwebProvider>
  );
}
