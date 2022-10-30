import {
  Button,
  Modal, ModalBody, ModalContent, ModalFooter,
  ModalHeader,
  ModalOverlay,
  Spacer,
  useDisclosure,
  HStack, Text, Heading} from "@chakra-ui/react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faArrowRightFromBracket} from "@fortawesome/free-solid-svg-icons";

const TopNav = (props) => {
  const { isOpen, onOpen, onClose} = useDisclosure();

  return (
    <HStack style={{
      background: "white",
      height: "10vh",
      padding: "6vh 5vw 6vh 5vw",
      fontFamily: "Poppins",
      marginBottom: "5vh"
    }}>
      <Heading as='h1' size='lg' fontWeight="400">
        Quick<span style={{color: "#012E8A", fontWeight: "700"}}>TA</span>
      </Heading>

      <Spacer/>

      <Text textAlign="right">
        <Text fontSize="2xs" marginRight="0.2vw">Logged in as</Text>
        <Text color="#012E8A" fontSize="lg" lineHeight="0.9" marginRight="0.2vw">{props.UTORid}</Text>
      </Text>
      <Button onClick={onOpen}>
        <FontAwesomeIcon icon={faArrowRightFromBracket} size={"lg"}/>
      </Button>
      <Modal isOpen={isOpen} onClose={onClose} >
        <ModalOverlay/>
        <ModalContent>
          <ModalHeader>
              Logout
          </ModalHeader>
          <ModalBody>
              Are you sure? Unsaved chats will not be saved.
          </ModalBody>

          <ModalFooter>
            <Button backgroundColor="#3278cd" marginRight="1vw" color="white">
              Logout
            </Button>
            <Button onClick={onClose} backgroundColor="#EFEFEF" color="#2D2D2D" >
              Cancel
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </HStack>
  );
}

export default TopNav;
