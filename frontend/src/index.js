import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './Pages/App';
import {
  ChakraProvider,
} from "@chakra-ui/react";
import theme from "./assets/theme";


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <div style={{
    background: "#F1F1F1",
    width: "100vw",
    height: "100vh"
  }}>
    <ChakraProvider theme={theme}>
      <App/>
    </ChakraProvider>
  </div>

);

