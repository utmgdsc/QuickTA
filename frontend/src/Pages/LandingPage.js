import { Text } from "@chakra-ui/react";
import { useState, useEffect } from "react";

const LandingPage = () => {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        background:
          "background: linear-gradient(90deg, rgba(58,82,180,1) 0%, rgba(29,126,253,1) 52%, rgba(153,204,255,1) 100%)",
      }}
    >
      <Text fontSize="5xl" as="b" color="black">
        Welcome to QuickTA
      </Text>
    </div>
  );
};

export default LandingPage;
