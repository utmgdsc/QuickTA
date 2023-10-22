import React from "react";
import ReactDOM from "react-dom/client";
import App from "./Pages/App";
import { ChakraProvider } from "@chakra-ui/react";
import theme from "./assets/theme";
import { BrowserRouter } from "react-router-dom";
import { QuickTaProvider } from "./Contexts/_QuickTaContext";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <QuickTaProvider>
    <ChakraProvider theme={theme}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </ChakraProvider>
  </QuickTaProvider>
);
