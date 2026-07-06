import { useState } from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

import App from "./App";
import AppLoader from "./components/AppLoader";

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