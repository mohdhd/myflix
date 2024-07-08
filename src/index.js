import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter } from "react-router-dom";
import App from "./components/App";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { Provider } from "react-redux";
import store from "./app/store";
import ToggleColorModeProvider from "./utils/ToggleColorMode";
import "./index.css";


ReactDOM.render(
    <Provider store={store}>
        <ToggleColorModeProvider>
            <BrowserRouter>
                <App />
            </BrowserRouter>
        </ToggleColorModeProvider>
    </Provider>,
    document.getElementById("root")
);
