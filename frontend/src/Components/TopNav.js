import {
  Spacer,
  HStack,
  Text,
  Heading,
} from "@chakra-ui/react";
import { NavLink } from "react-router-dom";

const TopNav = ({ UTORid, auth }) => {
  return (
    <HStack
      style={{
        background: "white",
        height: "10vh",
        padding: "6vh 5vw 6vh 5vw",
        fontFamily: "Poppins",
        marginBottom: "3vh",
        boxShadow: "0px 1px 2px 1px rgba(0,0,0,0.12)",
      }}
      as={"div"}
    >
      <Heading as="h1" size="lg" fontWeight="400">
        Quick<span style={{ color: "#012E8A", fontWeight: "700" }}>TA</span>
      </Heading>

      <Spacer />

      <HStack
        spacing="2vw"
        style={{
          marginRight: "2vw",
          overflowX: "scroll",
          paddingLeft: "1vw",
        }}
      >
        {["IS", "AM", "RS"].includes(auth) && (
          <NavLink to="/" exact activeClassName="active-link">
            Home
          </NavLink>
        )}
        {["IS", "AM", "RS"].includes(auth) && (
          <NavLink to="/analytics" activeClassName="active-link">
            Analytics
          </NavLink>
        )}
        {["AM", "RS"].includes(auth) && (
          <NavLink to="/models" activeClassName="active-link">
            Models
          </NavLink>
        )}
        {auth === "AM" && (
          <NavLink to="/settings" activeClassName="active-link">
            Settings
          </NavLink>
        )}
      </HStack>

      <Text textAlign="right">
        <Text fontSize="2xs" marginRight="0.2vw">
          Logged in as
        </Text>
        <Text
          color="#012E8A"
          fontSize="lg"
          lineHeight="0.9"
          marginRight="0.2vw"
        >
          {UTORid}
        </Text>
      </Text>
    </HStack>
  );
};

export default TopNav;
