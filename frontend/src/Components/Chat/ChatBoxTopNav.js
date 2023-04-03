import {
  Avatar,
  AvatarBadge,
  Button,
  HStack,
  Spacer,
  Text,
  VStack,
  Heading,
  Modal,
  useDisclosure, ModalOverlay, ModalContent, ModalCloseButton, Textarea, ModalHeader, ModalBody, ModalFooter, Tooltip
} from "@chakra-ui/react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faBug, faDownload} from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import {useState} from "react";

const ChatBoxTopNav = ({courseCode, currConvoID}) => {

  const { isOpen, onOpen, onClose } = useDisclosure();
  const fileDownload = require('js-file-download');
  const [reportMsg, setReportMsg] = useState("");
  return (
    <HStack paddingY={"4vh"} paddingX={"4vw"}>
    <Avatar>
      <AvatarBadge boxSize={'1em'} bg={'green.300'}/>
    </Avatar>
    <Text>
      <Text style={{
        fontSize: "lg",
        marginLeft: "0.5vw",
      }}>Automated teaching assistant for</Text>
      <Heading as='h2' size="lg" style={{color: "#012E8A", marginLeft: "0.5vw", lineHeight: "0.9"}}>{courseCode}</Heading>
    </Text>
    <Spacer/>

      <Button variant={'ghost'} 
        py={8} px={5}
        onClick={() => {
        if(currConvoID){
        axios.post(process.env.REACT_APP_API_URL + "/report", {conversation_id: currConvoID})
          .then((response) => {
            if(response.headers['content-disposition']){
              fileDownload(response.data, response.headers['content-disposition'].split('"')[1]);
            }
          })
          .catch((err) => console.log(err))
        }else{
          console.log("Must be in a conversation to download the chatlog!");
        }
      }}>
        <Tooltip label={"This may take a couple of minutes"}>
        <VStack>
          <FontAwesomeIcon icon={faDownload} size={'2x'}/>
            <Text fontSize="2xs">Download Conversation</Text>
        </VStack>
      </Tooltip>
      </Button>

      <Button variant={'ghost'} py={8} px={5} onClick={() => {
        if(currConvoID){
          onOpen();
        }else{
          console.log("Must be in a chat to report a conversation!")
        }
        }}>
        <Tooltip label={"See a bug?"}>
        <VStack>
          <FontAwesomeIcon icon={faBug} size={'2x'}/>
          <Text fontSize="2xs">Report</Text>
        </VStack>
        </Tooltip>
      </Button>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay/>
        <ModalContent>
          <ModalHeader>Report Bug</ModalHeader>
          <ModalCloseButton/>

          <ModalBody>
            <Textarea
              placeholder={"Please try your best to describe the problem you encountered!"}
              onChange={(e) => setReportMsg(e.target.value)}
            />
          </ModalBody>

          <ModalFooter>
            <Button colorScheme={'gray'} onClick={onClose}>
              Close
            </Button>
            <Button colorScheme={'red'} onClick={() => {
              if (reportMsg){
                axios.post(process.env.REACT_APP_API_URL + "/incorrect-answer", {conversation_id: currConvoID,
                  msg: reportMsg})
                  .then((res) => console.log("Reported!"))
                  .catch((err) => console.log(err))
                onClose();
              }
            }}>Report</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
  </HStack>
  );
}

export default ChatBoxTopNav;