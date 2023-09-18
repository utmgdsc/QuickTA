import {
    Button,
    Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, ModalOverlay,
    FormControl, FormLabel, FormHelperText,
    Divider,
    useDisclosure,
    Input,
    Box, Heading, Stack, HStack, NumberInputField, NumberInput
} from "@chakra-ui/react"
import {useState} from "react";
import axios from "axios";

const ModelCreator = ({creating, setCreating, courseid}) => {
    const {isOpen, onOpen, onClose} = useDisclosure();
    const [newModel, setNewModel] = useState({
        name: "",
        model: "",
        prompt: "",
        maxTokens: 0,
        topP: 0.0,
        presence_pen: 0.0,
        freq_pen: 0.0
    });

    function updateField(e){
        setNewModel({
            ...newModel,
            [e.target.name]: e.target.value
        });
    }

    function updateInt(e){
        setNewModel({
            ...newModel,
            [e.target.name]: isNaN(parseInt(e.target.value)) ? 0 : parseInt(e.target.value)
        });
    }

    function updateFloat(e){
        setNewModel({
            ...newModel,
            [e.target.name]: isNaN(parseFloat(e.target.value)) ? 0 : parseFloat(e.target.value)
        })
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

    const createModel = async () => {
        setCreating(true);
        await axios.post(process.env.REACT_APP_API_URL + "/models/gpt", {
            course_id: courseid,
            model_name: newModel.name,
            model: newModel.model,
            prompt: newModel.prompt,
            max_tokens: newModel.maxTokens,
            top_p: newModel.topP,
            presence_penalty: newModel.presence_pen,
            frequency_penalty: newModel.freq_pen
        })
          .then((res) => {setCreating(false); console.log(newModel);})
          .catch((err) => console.log(err))
    }

    return (
      <>
          <Box p='5px'><Button colorScheme='green' isDisabled={creating} onClick={onOpen}>Create</Button></Box>

          <Modal isOpen={isOpen} onClose={onClose} closeOnOverlayClick={false}>
              <ModalOverlay/>
              <ModalContent>
                  <ModalHeader>
                    <Heading size={'lg'}>Model Creator</Heading>
                  </ModalHeader>
                  <ModalBody>
                      <Stack spacing={2}>
                          <FormControl id={"Required Parameters"} isRequired>
                              <FormLabel>Name</FormLabel>
                              <Input onChange={updateField}
                                     value={newModel.name} name={"name"}/>

                              <FormLabel>Model</FormLabel>
                              <Input onChange={updateField}
                                     value={newModel.model} name={"model"}/>

                              <FormLabel>Prompt</FormLabel>
                              <Input onChange={updateField}
                                     value={newModel.prompt} name={"prompt"}/>
                          </FormControl>

                          <FormControl id={"Optional Parameters"}>
                              <FormLabel>Max Tokens</FormLabel>
                              <NumberInput>
                                  <NumberInputField onChange={updateInt} name={"maxTokens"} value={newModel.maxTokens}/>
                              </NumberInput>

                              <FormLabel>Top P</FormLabel>
                              <NumberInput>
                                  <NumberInputField onChange={updateFloat} name={"topP"} value={newModel.topP}/>
                              </NumberInput>

                              <FormLabel>Presence Penalty</FormLabel>
                              <NumberInput>
                                  <NumberInputField onChange={updateFloat} name={"presence_pen"} value={newModel.presence_pen}/>
                              </NumberInput>

                              <FormLabel>Frequency Penalty</FormLabel>
                              <NumberInput>
                                  <NumberInputField onChange={updateFloat} name={"freq_pen"} value={newModel.freq_pen}/>
                              </NumberInput>
                          </FormControl>

                      </Stack>
                  </ModalBody>
                  <ModalFooter>
                      <HStack spacing={3}>
                          <Button colorScheme={'green'} onClick={() => {
                              if(isValid(newModel)){
                                  onClose();
                                  createModel();
                                  setNewModel({
                                      name: "",
                                      model: "",
                                      prompt: "",
                                      maxTokens: 0,
                                      topP: 0.0,
                                      presence_pen: 0.0,
                                      freq_pen: 0.0
                                  });
                              }
                          }}>
                              Create Model
                          </Button>
                          <Button colorScheme={'blue'} onClick={() => {
                              onClose();
                              setNewModel({
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

export default ModelCreator;