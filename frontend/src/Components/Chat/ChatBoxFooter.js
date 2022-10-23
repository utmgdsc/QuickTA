import {
  Button, Center,
  HStack,
  Input,
  Modal, ModalBody, ModalContent, ModalFooter,
  ModalHeader,
  ModalOverlay,
  Slider, SliderFilledTrack,
  SliderMark, SliderThumb, SliderTrack, Spacer, Tooltip,
  useDisclosure
} from '@chakra-ui/react'
import {useState} from "react";

const ChatBoxFooter = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [sliderVal, setSliderVal] = useState(0);
  const [showTooltip, setSliderTooltip] = useState(false);

return(

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
              defaultValue={0}
              min={0}
              max={5}
              onChange={(currVal) => setSliderVal(currVal)}
              onMouseEnter={() => setSliderTooltip(true)}
              onMouseLeave={() => setSliderTooltip(false)}
              step={0.01}
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
           <Button bg={'teal'} color={'white'}>
             Send
           {/*  MODAL REDIRECT FOR MORE INFO IF BELOW 4 STARS*/}
           </Button>
           <Spacer/>
           <Button onClick={onClose}>
             Close
           </Button>
         </ModalFooter>
       </ModalContent>
     </Modal>
     <Input variant={'filled'}/>
     <Button colorScheme={'blue'} fontSize={'sm'}>
       Send
     </Button>
  </HStack>
 )
}

export default ChatBoxFooter;