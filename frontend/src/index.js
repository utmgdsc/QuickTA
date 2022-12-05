import React from 'react';
import ReactDOM from 'react-dom/client';
import App from "./Pages/App";
import {
  ChakraProvider,
} from "@chakra-ui/react";
import theme from "./assets/theme";
import { createBrowserHistory } from "history";
import {BrowserRouter} from "react-router-dom";

const history = createBrowserHistory();

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <ChakraProvider theme={theme}>
      <BrowserRouter>
        <App UTORid={"testuser1"}/>
      </BrowserRouter>
    </ChakraProvider>
);

