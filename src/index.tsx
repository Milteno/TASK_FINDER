import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { Provider } from "react-redux";
import store from "./redux/store";
import { restoreSession } from "./redux/features/userSlice/userSlice";
import { apiSlice } from "./redux/features/apiSlice/apiSlice";
import { LoadScript } from "@react-google-maps/api";
const rootElement = document.getElementById("root");

store.dispatch(restoreSession());
store.dispatch(apiSlice.endpoints.verifyToken.initiate(undefined));

const googleMapsApiKey = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;
console.log("Google Maps API Key:", process.env.REACT_APP_GOOGLE_MAPS_API_KEY);

if (rootElement) {
  const root = ReactDOM.createRoot(rootElement as HTMLElement);
  root.render(
    <React.StrictMode>
      <Provider store={store}>
        <LoadScript googleMapsApiKey={googleMapsApiKey!} libraries={["places"]}>
          <App />
        </LoadScript>
      </Provider>
    </React.StrictMode>
  );
}

reportWebVitals();
