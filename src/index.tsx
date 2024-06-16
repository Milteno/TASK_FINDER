import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { Provider } from "react-redux";
import store from "./redux/store";
import { restoreSession } from "./redux/features/userSlice/userSlice";
import { apiSlice } from "./redux/features/apiSlice/apiSlice";

const rootElement = document.getElementById("root");

store.dispatch(restoreSession());
store.dispatch(apiSlice.endpoints.verifyToken.initiate(undefined));

if (rootElement) {
  const root = ReactDOM.createRoot(rootElement as HTMLElement);
  root.render(
    <React.StrictMode>
      <Provider store={store}>
        <App />
      </Provider>
    </React.StrictMode>
  );
}

reportWebVitals();
