import {
  Button, Center,
  HStack, VStack,
  Input,
  Modal, ModalBody, ModalContent, ModalFooter,
  ModalHeader,
  ModalOverlay,
  Slider, SliderFilledTrack,
  SliderMark, SliderThumb, SliderTrack, Spacer, Tooltip,
  useDisclosure
} from '@chakra-ui/react'
import {useState, useEffect} from "react";
import axios from "axios";

const ChatBoxFooter = ({messages, updateMessages}) => {

  const { isOpen, onOpen, onClose } = useDisclosure();
  const [sliderVal, setSliderVal] = useState(0);
  const [showTooltip, setSliderTooltip] = useState(false);
  const [text, setText] = useState("");
  useEffect(() => console.log(messages), [messages])
return(
  <VStack>
   <HStack bgColor={'white'} p={5} >
    <Button colorScheme={'red'} fontSize={'sm'} onClick={onOpen}>
      End chat
    </Button>
     <Modal isOpen={isOpen} onClose={onClose} >
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
     </Modal>
     <Input variant={'filled'} placeholder={"Enter your message here"} onChange={(e) => {
       setText(e.target.value)
     }}/>

     <Button colorScheme={'blue'} fontSize={'sm'} onClick={() => {
      const temp1 = {
        message: text,
        dateSent: Date().toString(),
        isUser: "true"
        }
       // Load user message on click
      updateMessages((oldMessage) => [...oldMessage, temp1])
       axios.post("http://localhost:8000/api/chatlog", {conversation_id: "1", chatlog: text})
          .then((response) => {
            const temp2 = {
              message: response.data.agent.chatlog,
              dateSent: Date().toString(),
              isUser: "false"
              }
            updateMessages((oldMessage) => [...oldMessage, temp2])
          })
          .catch((err) => console.log(err))}
     }>
       Send
     </Button>
  </HStack>
  </VStack>
 )
}

export default ChatBoxFooter;