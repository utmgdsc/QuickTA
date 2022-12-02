import React from 'react';
import ReactDOM from 'react-dom/client';
import App from "./Pages/App";
import {
  ChakraProvider,
} from "@chakra-ui/react";
import theme from "./assets/theme";
import { createBrowserHistory } from "history";

const history = createBrowserHistory();

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <ChakraProvider theme={theme}>
      <App/>
    </ChakraProvider>
);

