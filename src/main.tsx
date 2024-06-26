import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { TonConnectUIProvider } from "@tonconnect/ui-react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { Helmet } from 'react-helmet';
import "./index.css";
import { Provider } from 'react-redux';
import {store} from './redux/store';

// this manifest is used temporarily for development purposes
const manifestUrl =
  "https://raw.githubusercontent.com/ton-community/tutorials/main/03-client/test/public/tonconnect-manifest.json";

const queryClient = new QueryClient({
  defaultOptions: { queries: { refetchOnWindowFocus: false } },
});

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
    <>
        <Provider store={store}>
            <TonConnectUIProvider manifestUrl={manifestUrl}>
                <QueryClientProvider client={queryClient}>
                    <App />
                </QueryClientProvider>
            </TonConnectUIProvider>
        </Provider>
    </>
);
