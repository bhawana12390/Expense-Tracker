import React from "react";
import ReactDOM from "react-dom";

import { ThemeProvider, createTheme } from '@mui/material/styles';
import { Provider } from "./context/context";
import App from "./App";
import './index.css';

const theme = createTheme();

ReactDOM.render(
    <Provider>
        <ThemeProvider theme={theme}>
            <App />
        </ThemeProvider>
    </Provider>
    ,
    document.getElementById('root')
);