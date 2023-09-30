import {extendTheme} from "@chakra-ui/react";
import "@fontsource/poppins";
const theme = extendTheme({
  fonts: {
    heading: "Poppins",
    body: "Poppins",
  },
  styles: {
    global: {
      "::-webkit-scrollbar": {
        width: "4px", /* Width of the scrollbar */
      },
      "::-webkit-scrollbar-track": {
        background: "#f1f1f1", /* Background color of the track */
      },
      "::-webkit-scrollbar-thumb": {
        background: "#012E8A", /* Background color of the thumb */
        borderRadius: "6px", /* Rounded corners for the thumb */
      },
      "::-webkit-scrollbar-thumb:hover": {
        background: "#555", /* Background color on hover */
      },
      
    },
  },
})

export default theme