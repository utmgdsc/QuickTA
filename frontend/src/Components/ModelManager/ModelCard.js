import {
  Box,
  Text,
  Spacer,
  Flex,
  Button,
  color,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  FormLabel,
  Switch,
  FormControl, Heading, Stack, Input, ModalFooter, ModalCloseButton, HStack, Divider, NumberInput, NumberInputField,
} from "@chakra-ui/react"
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {useEffect, useState} from "react";
import axios from "axios";

const ModelCard = ({modelName, colorScheme, modelId, courseid, modelStatus, setCurrentModel, setEnabling, enabling}) => {
    const {isOpen, onOpen, onClose} = useDisclosure();
    const [newModelSettings, setModelSettings] = useState({
      name: "",
      model: "",
      prompt: "",
      maxTokens: 0,
      topP: 0.0,
      presence_pen: 0.0,
      freq_pen: 0.0
    });

    function updateField(e){
      setModelSettings({
        ...newModelSettings,
        [e.target.name]: e.target.value
      });
    }

    function isValid(obj){
      for(const [key, value] of Object.entries(obj)){
        if (["name", "model", "prompt"].includes(key)) {
          if (value.length <= 0) {
            return false;
          }
        }else if(key === "maxTokens") {
          if (isNaN(value) || value < 0) {
            return false
          }
        }else {
          if (isNaN(value)) {
            return false
          }
        }
      }return true;
    }

    const updateModel = async () => {
      setEnabling(true);
      await axios.post(process.env.REACT_APP_API_URL + "/researcher/gptmodel-update", {
        model_id: modelId,
        course_id: courseid,
        model_name: newModelSettings.name,
        model: newModelSettings.model,
        prompt: newModelSettings.prompt,
        max_tokens: newModelSettings.maxTokens,
        top_p: newModelSettings.topP,
        presence_penalty: newModelSettings.presence_pen,
        frequency_penalty: newModelSettings.freq_pen
      })
        .then((res) => {setEnabling(false);})
        .catch((err) => console.log(err))
    }

    const enableModel = async () => {
      setEnabling(true);
      await axios.post(process.env.REACT_APP_API_URL + "/researcher/gptmodel-activate", {course_id: courseid, model_id: modelId})
        .then((res) => {
          setCurrentModel(modelId);
          setEnabling(false);
        })
        .catch((err) => console.log(err))
    }

    const fetchModelDetails = async () => {
        return await axios.post(process.env.REACT_APP_API_URL + "/researcher/gptmodel-get")
          .then((res) => {})
          .catch((err) => console.log(err))
    }

    function updateInt(e){
      setModelSettings({
        ...newModelSettings,
        [e.target.name]: isNaN(parseInt(e.target.value)) ? 0 : parseInt(e.target.value)
      });
    }

    function updateFloat(e){
      setModelSettings({
        ...newModelSettings,
        [e.target.name]: isNaN(parseFloat(e.target.value)) ? 0 : parseFloat(e.target.value)
      })
    }

    useState(() => {
      setModelSettings({
        name: "",
        model: "",
        prompt: "",
        maxTokens: 0,
        topP: 0.0,
        presence_pen: 0.0,
        freq_pen: 0.0
      });
    }, [courseid])

    return (
      <>
        <Button colorScheme={colorScheme} boxSizing='border-box' p='10px' onClick={() => {
          onOpen();
          console.log(newModelSettings);
        }} isDisabled={enabling}>
            <Box borderBottom='2px' pb='5px'>
                <Flex>
                        <Text size='lg' fontWeight='500'>{modelName}</Text>
                </Flex>
            </Box>
        </Button>

        <Modal isOpen={isOpen} onClose={onClose} closeOnOverlayClick={false}>
          <ModalOverlay/>
          <ModalContent>
            <ModalHeader>
              <Heading size={'xl'}>{modelName}</Heading>
            </ModalHeader>
            <ModalBody>
              <Heading size={'lg'}>Enable Model:</Heading>
              <Switch id='model-status'
                      defaultChecked={modelStatus}
                      isReadOnly={modelStatus}
                      p={5}
                      onChange={() => {
                        enableModel();
                        onClose();
                      }}/>
              <Divider/>

              <Heading size={'lg'}>Model Editor</Heading>

              <Stack spacing={2}>

                <FormControl id={"Required Parameters"} isRequired>
                  <FormLabel>Name</FormLabel>
                  <Input onChange={updateField}
                         value={newModelSettings.name} name={"name"}/>

                  <FormLabel>Model</FormLabel>
                  <Input onChange={updateField}
                  value={newModelSettings.model} name={"model"}/>

                  <FormLabel>Prompt</FormLabel>
                  <Input onChange={updateField}
                  value={newModelSettings.prompt} name={"prompt"}/>
                </FormControl>

                <FormControl id={"Optional Parameters"}>
                  <FormLabel>Max Tokens</FormLabel>
                  <NumberInput>
                    <NumberInputField onChange={updateInt} name={"maxTokens"} value={newModelSettings.maxTokens}/>
                  </NumberInput>



                  <FormLabel>Top P</FormLabel>
                  <Input onChange={updateFloat}
                  value={newModelSettings.topP} name={"topP"}/>

                  <FormLabel>Presence Penalty</FormLabel>
                  <Input onChange={updateFloat}
                  value={newModelSettings.presence_pen} name={"presence_pen"}/>

                  <FormLabel>Frequency Penalty</FormLabel>
                  <Input onChange={updateFloat}
                  value={newModelSettings.freq_pen} name={"freq_pen"} />
                </FormControl>
              </Stack>
            </ModalBody>
            <ModalFooter>
              <HStack spacing={3}>
                <Button colorScheme={'green'} onClick={() => {
                  if(isValid(newModelSettings)){
                    onClose();
                    updateModel();
                    setModelSettings({
                      name: "",
                      model: "",
                      prompt: "",
                      maxTokens: 0,
                      topP: 0.0,
                      presence_pen: 0.0,
                      freq_pen: 0.0
                    })
                  }
                }}>
                  Submit Edits
                </Button>
                <Button colorScheme={'blue'} onClick={() => {
                  onClose();
                  setModelSettings({
                    name: "",
                    model: "",
                    prompt: "",
                    maxTokens: 0,
                    topP: 0.0,
                    presence_pen: 0.0,
                    freq_pen: 0.0
                  });
                }
                }>
                  Close
                </Button>
              </HStack>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </>
    );
}

export default ModelCard;