import {
  Button, Center, HStack, Input,
  Modal, ModalBody, ModalContent, ModalFooter,
  ModalHeader,
  ModalOverlay,
  Slider, SliderFilledTrack,
  SliderMark, SliderThumb, SliderTrack, Textarea, Tooltip, VStack
} from '@chakra-ui/react'
import {useState} from "react";
import axios from "axios";

const FeedbackSurvey = ({ isOpen, onClose, conversation_id, updateConvoID, updateInConvo, updateMessages }) => {

  const [sliderVal, setSliderVal] = useState(0);
  const [showTooltip, setSliderTooltip] = useState(false);

  const [askFeedBack, setFeedBackPopup] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [isSurveyDisabled, setIsSurveyDisabled] = useState(false);

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay/>
      <ModalContent>
        <ModalHeader>
          <span style={{
            fontFamily: "Poppins"
          }}>Please rate your Experience with us
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
            isDisabled={isSurveyDisabled}
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
          {askFeedBack ?
            <HStack>
              <Textarea
              size={'lg'}
              placeholder={'Any feedback would appreciated!'}
              onChange={(e) => {setFeedback(e.target.value)}}/>
              <Button onClick={async () => {
                console.log(conversation_id, sliderVal, feedback);
                await axios.post(process.env.REACT_APP_API_URL + "/feedback", {
                  conversation_id: conversation_id,
                  rating: sliderVal, feedback_msg: feedback
                })
                  .then((res) => {
                    updateConvoID("");
                    updateInConvo(false);
                    updateMessages([]);
                    setFeedBackPopup(false);
                    setIsSurveyDisabled(false);
                    onClose();
                  })
                  .catch((err) => console.log(err))
              }
              }>Send</Button>
            </HStack>
            : null}
          <Button colorScheme={'green'} onClick={() => {
            if (sliderVal < 4){
              setFeedBackPopup(true);
              setIsSurveyDisabled(true);
            }else{
              (async () => {
                await axios.post(process.env.REACT_APP_API_URL + "/feedback", {conversation_id: conversation_id,
                rating: sliderVal, feedback_msg: ""})
              })()
            }
          }}>
            Submit
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}

export default FeedbackSurvey;