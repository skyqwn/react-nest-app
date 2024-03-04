import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";

import { BrowserRouter } from "react-router-dom";

import { CookiesProvider } from "react-cookie";
import { HelmetProvider } from "react-helmet-async";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { UserContextProvider } from "./context/UserContext";

export const queryClient = new QueryClient({
  defaultOptions: {
    // react-query 전역 설정
    queries: {
      refetchOnWindowFocus: false,
      retryOnMount: true,
      refetchOnReconnect: false,
      retry: false,
    },
  },
});

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <HelmetProvider>
    <QueryClientProvider client={queryClient}>
      <UserContextProvider>
        <CookiesProvider>
          <BrowserRouter>
            <App />
            <ReactQueryDevtools
              initialIsOpen={process.env.REACT_APP_PUBLIC_MODE === "local"}
            />
          </BrowserRouter>
        </CookiesProvider>
      </UserContextProvider>
    </QueryClientProvider>
  </HelmetProvider>
);
