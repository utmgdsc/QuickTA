import {
  Button, HStack, Input,
  useDisclosure
} from '@chakra-ui/react'
import {useState, useEffect} from "react";
import axios from "axios";

const ChatBoxFooter = ({
  messages, 
  updateMessages, 
  inConvo, 
  updateIsConvo, 
  currConvoID, 
  updateConvoID
}) => {

  const { isOpen, onOpen, onClose } = useDisclosure();
  const [sliderVal, setSliderVal] = useState(0);
  const [showTooltip, setSliderTooltip] = useState(false);
  const [text, setText] = useState("");
  useEffect(() => console.log(messages), [messages])

  return(
   <HStack bgColor={'white'} p={5} paddingX={"3vw"} borderTop={'2px solid #EAEAEA'}>
    <Button colorScheme={'green'} fontSize={'sm'} onClick={() => {
      if(inConvo){
        console.log("You're already in a conversation!")
      }else{
        console.log("Started a conversation!")
        axios.post("http://localhost:8000/api/conversation", {"user_id": "testuser1", "semester": "2022F"})
        .then(
          (response) => {
            updateConvoID(response.data.conversation_id);
            updateIsConvo(true);
            console.log(currConvoID, inConvo);
          }
        )
        .catch((err) => {console.log(err)})        
      }
    }}>
      Start Conversation
    </Button>
    <Button colorScheme={'red'} fontSize={'sm'} onClick={() => {
      if(inConvo){
        updateConvoID("");
        updateIsConvo(false);
        // onOpen();
      }else{
        console.log("Must be in a convo to leave one :>")
      }
    }}>
      End chat
    </Button>
     {/* <Modal isOpen={isOpen} onClose={onClose} >
       <ModalOverlay/>
       <ModalContent>
         <ModalHeader>
           <span style={{
             fontFamily: "Poppins"
           }}>Please rate your experience with Quick<span style={{
             fontFamily: "Poppins",
             color: "#012E8A",
             fontWeight: "bold"
           }}>TA</span>
        </span>
         </ModalHeader>
         <ModalBody>
            <Slider
              defaultValue={1}
              min={1}
              max={5}
              onChange={(currVal) => setSliderVal(currVal)}
              onMouseEnter={() => setSliderTooltip(true)}
              onMouseLeave={() => setSliderTooltip(false)}
              step={1}
            >
              <SliderMark value={1} mt={1} fontSize={'smaller'}>1</SliderMark>
              <SliderMark value={2} mt={1} fontSize={'smaller'}>2</SliderMark>
              <SliderMark value={3} mt={1} fontSize={'smaller'}>3</SliderMark>
              <SliderMark value={4} mt={1} fontSize={'smaller'}>4</SliderMark>
              <SliderMark value={5} mt={1} fontSize={'smaller'}>5</SliderMark>
              <SliderTrack>
              <SliderFilledTrack/>
              </SliderTrack>
              <Tooltip
                hasArrow
                bg='#012E8A'
                color='white'
                placement='top'
                isOpen={showTooltip}
                label={`${sliderVal}`}
              >
                <SliderThumb />
              </Tooltip>
            </Slider>
         </ModalBody>
         <ModalFooter>
           <Button colorScheme={'green'}>
             Submit
           </Button>
           <Spacer/>
           <Button onClick={onClose}>
             Close
           </Button>
         </ModalFooter>
       </ModalContent>
     </Modal> */}
     <Input variant={'filled'} placeholder={"Enter your message here"} onChange={(e) => {
       setText(e.target.value)
     }}/>

     <Button backgroundColor={"#3278cd"} colorScheme={'blue'} fontSize={'sm'} onClick={() => {
      if(inConvo){
        const temp1 = {
          message: text,
          dateSent: Date().toString(),
          isUser: "true"
          }
         // Load user message on click
        updateMessages((oldMessage) => [...oldMessage, temp1])
         axios.post("http://localhost:8000/api/chatlog", {conversation_id: currConvoID, chatlog: text})
            .then((response) => {
              const temp2 = {
                message: response.data.agent.chatlog,
                dateSent: Date().toString(),
                isUser: "false"
                }
              updateMessages((oldMessage) => [...oldMessage, temp2])
            })
            .catch((err) => console.log(err))
      }else{
        console.log("must start a conversation to send a message to AI!")
      }
      
    }}>
       Send
     </Button>
  </HStack>
 )
}

export default ChatBoxFooter;