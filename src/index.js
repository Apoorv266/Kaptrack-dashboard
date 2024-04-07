import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import DashboardContextWrapper from "./Context/DashboardContext";
import { BrowserRouter } from "react-router-dom";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <DashboardContextWrapper>
        <App />
      </DashboardContextWrapper>
    </BrowserRouter>
  </React.StrictMode>
);
