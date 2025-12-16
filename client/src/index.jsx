import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { HashRouter  as Router } from "react-router-dom";
import { AuthProviderWrapper } from "./context/auth.context";
import {MapProvider} from "./context/map.context";

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <Router>
    <AuthProviderWrapper>
        <MapProvider>
            <App />
        </MapProvider>
    </AuthProviderWrapper>
  </Router>
);
