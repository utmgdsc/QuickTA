import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Spacer,
  useDisclosure,
  HStack,
  Text,
  Heading,
} from "@chakra-ui/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRightFromBracket } from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";
import { NavLink } from "react-router-dom";

const TopNav = ({ UTORid, auth }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [showNavbar, setShowNavbar] = useState(false);

  if (["IS", "AM", "RS"].includes(auth)) {
    return <></>;
  }

  if (["IS", "AM", "RS"].includes(auth)) {
    setShowNavbar(true);
  }

  return (
    <HStack
      style={{
        background: "white",
        height: "10vh",
        padding: "6vh 5vw 6vh 5vw",
        fontFamily: "Poppins",
        marginBottom: "5vh",
        boxShadow: "0px 1px 2px 1px rgba(0,0,0,0.12)",
      }}
      as={"div"}
    >
      <Heading as="h1" size="lg" fontWeight="400">
        Quick<span style={{ color: "#012E8A", fontWeight: "700" }}>TA</span>
      </Heading>

      <Spacer />

      {showNavbar ? (
        <></>
      ) : (
        <HStack
          spacing="2vw"
          style={{
            marginRight: "2vw",
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
          {["IS", "AM", "RS"].includes(auth) && (
            <NavLink to="/models" activeClassName="active-link">
              Models
            </NavLink>
          )}
          {["IS", "AM", "RS"].includes(auth) && (
            <NavLink to="/filter" activeClassName="active-link">
              Filter
            </NavLink>
          )}
          {auth === "AM" && (
            <NavLink to="/settings" activeClassName="active-link">
              Settings
            </NavLink>
          )}
        </HStack>
      )}

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
      <Button onClick={onOpen}>
        <FontAwesomeIcon icon={faArrowRightFromBracket} size={"lg"} />
      </Button>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Logout</ModalHeader>
          <ModalBody>Are you sure? Unsaved chats will not be saved.</ModalBody>

          <ModalFooter>
            <Button
              backgroundColor="#3278cd"
              marginRight="1vw"
              color="white"
              colorScheme="blue"
            >
              Logout
            </Button>
            <Button onClick={onClose} backgroundColor="#EFEFEF" color="#2D2D2D">
              Cancel
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </HStack>
  );
};

export default TopNav;
