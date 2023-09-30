import { extendTheme } from "@chakra-ui/react";
import "@fontsource/poppins";
const theme = extendTheme({
  fonts: {
    heading: "Poppins",
    body: "Poppins",
  },
  styles: {
    global: {},
  },
});

export default theme;
