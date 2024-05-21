import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { TonConnectUIProvider } from "@tonconnect/ui-react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { Helmet } from 'react-helmet';
import "./index.css";

const queryClient = new QueryClient({
  defaultOptions: { queries: { refetchOnWindowFocus: false } },
});

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
    <>
        <Helmet>
            <script src="https://telegram.org/js/telegram-web-app.js"></script>
        </Helmet>
        <TonConnectUIProvider>
            <QueryClientProvider client={queryClient}>
                <App />
            </QueryClientProvider>
        </TonConnectUIProvider>
    </>
);
