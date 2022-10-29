import {
    Button,
    Modal, ModalBody, ModalContent, ModalFooter,
    ModalHeader,
    ModalOverlay,
    Slider, SliderFilledTrack,
    SliderMark, SliderThumb, SliderTrack, Spacer, Tooltip,
    useDisclosure
  } from '@chakra-ui/react'
  import {useState} from "react";

const ChatOpenSurvey = () => {
    const { isOpen, onOpen, onClose} = useDisclosure({defaultIsOpen: true});
    const [sliderVal, setSliderVal] = useState(0);
    const [showTooltip, setSliderTooltip] = useState(false);
    
    return (
        <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay/>
        <ModalContent>
          <ModalHeader>
            <span style={{
              fontFamily: "Poppins"
            }}>Please rate your current comfortability with the course material
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
            <Button colorScheme={'green'} onClick={onClose}>
              Submit
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    )
}

export default ChatOpenSurvey;