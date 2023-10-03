import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";

import "cal-sans";
import "~/styles/global.css";
import "~/styles/nprogress.css";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
