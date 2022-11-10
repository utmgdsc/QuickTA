import React from 'react';
import ReactDOM from 'react-dom/client';
import App from "./Pages/App";
import {
  ChakraProvider,
} from "@chakra-ui/react";
import theme from "./assets/theme";
import { Router, Route, RouterProvider } from 'react-router';
import { createBrowserRouter } from 'react-router-dom';
import StudentPage from './Pages/StudentPage';
import { createBrowserHistory } from "history";

const history = createBrowserHistory();

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <ChakraProvider theme={theme}>
      <App/>
    </ChakraProvider>
);

