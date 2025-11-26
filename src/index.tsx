import "regenerator-runtime/runtime";
import "whatwg-fetch";

import React from "react";
import { createRoot } from 'react-dom/client';

import "./index.scss";
import Root from "./domain/app/AppRoot";
import history from "./domain/app/appHistory";
import reportWebVitals from "./reportWebVitals";

const container = document.getElementById("root");
if (!container) {
  throw new Error("Failed to find the root element");
}
const root = createRoot(container); // createRoot(container!) if you use TypeScript
root.render(
  <React.StrictMode>
    <Root history={history} />
  </React.StrictMode>);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
