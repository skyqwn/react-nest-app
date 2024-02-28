import {
  useQuery,
  useMutation,
  useQueryClient,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";

import { BrowserRouter } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";

const queryClient = new QueryClient();

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <HelmetProvider>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </QueryClientProvider>
  </HelmetProvider>
);
