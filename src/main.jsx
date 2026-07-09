import { useState } from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { QueryClientProvider } from "@tanstack/react-query";

import App from "./App";
import AppLoader from "./components/AppLoader";
import { QueryClient } from '@tanstack/react-query';

function Root() {
  const [loading, setLoading] = useState(true);


const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60,      // 1 min — data considered fresh for 1 min
      retry: 1,                   // retry failed queries once
      refetchOnWindowFocus: false, // don't refetch every time tab regains focus
    },
  },
});

  return (
    <QueryClientProvider client={queryClient}>
      {loading ? (
        <AppLoader onComplete={() => setLoading(false)} />
      ) : (
        <BrowserRouter>
          <App />
        </BrowserRouter>
      )}
    </QueryClientProvider>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<Root />);