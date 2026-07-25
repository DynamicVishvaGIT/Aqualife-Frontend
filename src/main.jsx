import { useState } from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import App from "./App";
import "./App.css";
import { registerSW } from "virtual:pwa-register";

// Register Service Worker
registerSW({ immediate: true });

// Create Query Client only once
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60, // 1 minute
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

function Root() {
  const [loading, setLoading] = useState(true);

  return (
    <QueryClientProvider client={queryClient}>
   
        <BrowserRouter>
          <App />
        </BrowserRouter>
      
    </QueryClientProvider>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<Root />);