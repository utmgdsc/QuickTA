import {
  Spacer,
  HStack,
  Text,
  Heading,
} from "@chakra-ui/react";
import { NavLink } from "react-router-dom";
import {useEffect, useRef, useState} from "react";
import {Button, FormControl} from "@mui/material";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import InputLabel from "@mui/material/InputLabel";

const TopNav = ({ UTORid, auth }) => {
  const [open, setOpen] = useState(false);
  const anchorRef = useRef(null);

  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  const handleClose = (event) => {
    if (anchorRef.current && anchorRef.current.contains(event.target)) {
      return;
    }

    setOpen(false);
  };

  function handleListKeyDown(event) {
    if (event.key === 'Tab') {
      event.preventDefault();
      setOpen(false);
    } else if (event.key === 'Escape') {
      setOpen(false);
    }
  }

  // return focus to the button when we transitioned from !open -> open
  const prevOpen = useRef(open);
  useEffect(() => {
    if (prevOpen.current === true && open === false) {
      anchorRef.current.focus();
    }

    prevOpen.current = open;
  }, [open]);

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
      <Heading as="h1" size="lg" fontWeight="400" style={{ fontSize: "30px", lineHeight: '36px'}}>
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
            <FormControl variant="standard">
              <InputLabel id="demo-simple-select-standard-label">Settings</InputLabel>
              <Select
              label="Settings">
                <MenuItem disabled value="">
                  <em>Settings</em>
                </MenuItem>
                <MenuItem>
                {["IS", "AM", "RS"].includes(auth) && (
                    <NavLink to="/courses" activeClassName="active-link">
                        Courses
                    </NavLink>
                )}
                </MenuItem>
                <MenuItem>
                {["IS", "AM", "RS"].includes(auth) && (
                    <NavLink to="/users" activeClassName="active-link">
                        Users
                    </NavLink>
                )}
                </MenuItem>
                <MenuItem>
                {["IS", "AM", "RS"].includes(auth) && (
                    <NavLink to="/history" activeClassName="active-link">
                        History
                    </NavLink>
                )}
                </MenuItem>
              </Select>
            </FormControl>

          // <NavLink activeClassName="active-link">
          //   Settings
          // </NavLink>

        )}
        {/*{["IS", "AM", "RS"].includes(auth) && (*/}
        {/*    <NavLink to="/courses" activeClassName="active-link">*/}
        {/*        Courses*/}
        {/*    </NavLink>*/}
        {/*)}*/}
        {/*{["IS", "AM", "RS"].includes(auth) && (*/}
        {/*    <NavLink to="/users" activeClassName="active-link">*/}
        {/*        Users*/}
        {/*    </NavLink>*/}
        {/*)}*/}
        {/*{["IS", "AM", "RS"].includes(auth) && (*/}
        {/*    <NavLink to="/history" activeClassName="active-link">*/}
        {/*        History*/}
        {/*    </NavLink>*/}
        {/*)}*/}
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
