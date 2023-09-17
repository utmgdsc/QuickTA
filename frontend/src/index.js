import React from "react";
import ReactDOM from "react-dom/client";
import App from "./Pages/App";
import { ChakraProvider } from "@chakra-ui/react";
import theme from "./assets/theme";
import { BrowserRouter } from "react-router-dom";
import AdminPage from "./Pages/AdminPage";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <ChakraProvider theme={theme}>
    <BrowserRouter>
      <AdminPage UTORID={"choiman3"} />
    </BrowserRouter>
  </ChakraProvider>
);
