import {
  Button, Input,
  Modal, ModalBody, ModalContent, ModalFooter,
  ModalHeader,
  ModalOverlay,
  Slider, SliderFilledTrack,
  SliderMark, SliderThumb, SliderTrack, Tooltip
} from '@chakra-ui/react'
import {useState} from "react";

const FeedbackSurvey = ({ isOpen, onClose }) => {

  const [sliderVal, setSliderVal] = useState(0);
  const [showTooltip, setSliderTooltip] = useState(false);
  const [askFeedBack, setFeedBackPopup] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [isSurveyDisabled, setIsSurveyDisabled] = useState(true);

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
            onChangeEnd={(currVal) => setSliderVal(currVal)}
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
          {askFeedBack ? <Input
            size={'lg'}
            placeholder={'Any feedback would appreciated!'}
            onChange={(e) => {setFeedback(e.target.value)}}
          /> : null}
          <Button colorScheme={'green'} onClick={() => {
            if (sliderVal < 4){
              setIsSurveyDisabled(false);
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