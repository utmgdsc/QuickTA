import {
  Button,
  Modal, ModalBody, ModalContent, ModalFooter,
  ModalHeader,
  ModalOverlay,
  Spacer,
  useDisclosure,
  HStack, Text} from "@chakra-ui/react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faArrowRightFromBracket} from "@fortawesome/free-solid-svg-icons";

const TopNav = (props) => {
  const { isOpen, onOpen, onClose} = useDisclosure();

  return (
    <HStack style={{
      background: "white",
      height: "10vh",
      paddingInline: "5vw",
      fontFamily: "Poppins",
      marginBottom: "5vh"
    }}>
        <span style={{
          fontFamily: "Poppins"
        }}>Quick<span style={{
          fontFamily: "Poppins",
          color: "#012E8A",
          fontWeight: "bold"
        }}>TA</span>
        </span>

      <Spacer/>

      <Text>
        <Text style={{
          fontSize: "xx-small",
        }}>Logged in as</Text>
        <Text style={{
          color: "#012E8A",
        }}>{props.UTORid}</Text>
      </Text>
      <Button onClick={onOpen}>
        <FontAwesomeIcon icon={faArrowRightFromBracket} size={"lg"}/>
      </Button>
      <Modal isOpen={isOpen} onClose={onClose} >
       <ModalOverlay/>
       <ModalContent>
         <ModalHeader>
           <span style={{
             fontFamily: "Poppins"
           }}>Logout
        </span>
         </ModalHeader>
         <ModalBody>
          <span style={{
              fontFamily: "Poppins"
            }}>Are you sure? Unsaved chats will not be saved.
          </span>
         </ModalBody>

         <ModalFooter>
           <Button colorScheme={'green'}>
             Yes
           </Button>
           <Spacer/>
           <Button onClick={onClose} colorScheme={'red'}>
             No
           </Button>
         </ModalFooter>
       </ModalContent>
      </Modal>
    </HStack>
  );
}

export default TopNav;
