import React, { useState } from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import AppLoader from "./components/AppLoader"

import App from "./App";

function Root() {
  const [loading, setLoading] = useState(true);

  return loading ? (
    <AppLoader onComplete={() => setLoading(false)} />
  ) : (
    <BrowserRouter>
      <App />
    </BrowserRouter>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<Root />);