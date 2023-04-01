import {
  Button, Center, HStack, Input,
  Modal, ModalBody, ModalContent, ModalFooter,
  ModalHeader,
  ModalOverlay,
  Slider, SliderFilledTrack,
  SliderMark, SliderThumb, SliderTrack, Spacer, Textarea, Tooltip, VStack
} from '@chakra-ui/react'
import {useState} from "react";
import axios from "axios";

const FeedbackSurvey = ({ isOpen, onClose, conversation_id, updateConvoID, updateInConvo, updateMessages }) => {

  const [sliderVal, setSliderVal] = useState(1);

  const [askFeedBack, setFeedBackPopup] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [isSurveyDisabled, setIsSurveyDisabled] = useState(false);

  return (
    <Modal closeOnOverlayClick={false} isOpen={isOpen} onClose={onClose}>
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
            <SliderThumb />
          </Slider>
        </ModalBody>

        <ModalFooter>
          { askFeedBack ?
            (<VStack>
              <Textarea
              size={'lg'}
              placeholder={'Any feedback would appreciated!'}
              onChange={(e) => {setFeedback(e.target.value)}}/>
              <Button colorScheme={'green'} onClick={async () => {
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
              }>Submit</Button>
            </VStack>)
            :
                (<Button 
                colorScheme={'green'} 
                onClick={() => {
                  if (sliderVal < 4){
                    setFeedBackPopup(true);
                    setIsSurveyDisabled(true);
                  }else{
                    (async () => {
                      await axios.post(process.env.REACT_APP_API_URL + "/feedback", {conversation_id: conversation_id,
                      rating: sliderVal, feedback_msg: ""})
                      updateConvoID("");
                      updateInConvo(false);
                      updateMessages([]);
                      setFeedBackPopup(false);
                      setIsSurveyDisabled(false);
                      onClose();
                    })()
                  }
                }}
                >
                  Submit
                </Button>)
          }
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}

export default FeedbackSurvey;