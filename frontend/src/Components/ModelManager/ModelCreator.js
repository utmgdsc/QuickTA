import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  FormControl,
  FormLabel,
  useDisclosure,
  Input,
  Box,
  Heading,
  Stack,
  HStack,
  NumberInputField,
  NumberInput,
  Textarea,
  Select,
} from "@chakra-ui/react";
import { useState } from "react";
import axios from "axios";
import ErrorDrawer from "../ErrorDrawer";

const ModelCreator = ({ creating, setCreating, courseid }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [newModel, setNewModel] = useState({
    name: "",
    model: "",
    prompt: "",
    temperature: 0,
    maxTokens: 0,
    topP: 0.0,
    presence_pen: 0.0,
    freq_pen: 0.0,
  });
  const {
    isOpen: isErrOpen,
    onOpen: onErrOpen,
    onClose: onErrClose,
  } = useDisclosure();
  const [error, setError] = useState();
  function updateField(e) {
    setNewModel({
      ...newModel,
      [e.target.name]: e.target.value,
    });
  }

  function updateInt(e) {
    setNewModel({
      ...newModel,
      [e.target.name]: isNaN(parseInt(e.target.value))
        ? 0
        : parseInt(e.target.value),
    });
  }

  function updateFloat(e) {
    setNewModel({
      ...newModel,
      [e.target.name]: isNaN(parseFloat(e.target.value))
        ? 0
        : parseFloat(e.target.value),
    });
  }

  function isValid(obj) {
    for (const [key, value] of Object.entries(obj)) {
      if (["name", "model", "prompt"].includes(key)) {
        if (value.length <= 0) {
          // console.log(`Invalid length for ${key}`);
          return false;
        }
      } else if (key === "maxTokens") {
        if (isNaN(value) || value < 0) {
          // console.log("Invalid maxTokens");
          return false;
        }
      } else {
        if (isNaN(value)) {
          // console.log("One of the values is NaN");
          return false;
        }
      }
    }
    return true;
  }

  const createModel = async () => {
    setCreating(true);
    await axios
      .post(process.env.REACT_APP_API_URL + "/models/gpt", {
        course_id: courseid,
        model_name: newModel.name,
        model: newModel.model,
        prompt: newModel.prompt,
        temperature: newModel.temperature,
        max_tokens: newModel.maxTokens,
        top_p: newModel.topP,
        presence_penalty: newModel.presence_pen,
        frequency_penalty: newModel.freq_pen,
      })
      .then((res) => {
        setCreating(false);
        // console.log(newModel);
      })
      .catch((err) => {
        setError(err);
        // console.log(err);
        onErrOpen();
      });
  };

  return (
    <>
      <Box p="5px">
        <Button colorScheme="green" isDisabled={creating} onClick={onOpen}>
          Create
        </Button>
      </Box>

      <Box
        // isOpen={isOpen}
        // onClose={onClose}
        // closeOnOverlayClick={false}
        // scrollBehavior="inside"
      >
        <Box>
          <Box>
            <Heading size={"lg"}>Model Creator</Heading>
          </Box>
          <Box background="#F9F9F9">
            <Stack spacing={2}>
              <FormControl id={"Required Parameters"} isRequired>
                <FormLabel>Name</FormLabel>
                <Input
                  onChange={updateField}
                  value={newModel.name}
                  name={"name"}
                />

                <FormLabel>Model</FormLabel>
                {/*<Input onChange={updateField}*/}
                {/*       value={newModel.model} name={"model"}/>*/}
                <Select
                  onChange={updateField}
                  name={"model"}
                  placeholder={"Please select an option"}
                >
                  {["gpt-4", "gpt-3.5-turbo", "gpt-3.5-turbo-16k"].map(
                    (model, index) => (
                      <option key={index} value={model}>
                        {model}
                      </option>
                    )
                  )}
                </Select>

                <FormLabel>Prompt</FormLabel>
                <Textarea
                  onChange={updateField}
                  value={newModel.prompt}
                  name={"prompt"}
                  style={{ minHeight: "320px" }}
                />
              </FormControl>

              <FormControl id={"Optional Parameters"}>
                <FormLabel>Temperature</FormLabel>
                <NumberInput>
                  <NumberInputField
                    onChange={updateInt}
                    name={"temperature"}
                    value={newModel.temperature}
                  />
                </NumberInput>

                <FormLabel>Max Tokens</FormLabel>
                <NumberInput>
                  <NumberInputField
                    onChange={updateInt}
                    name={"maxTokens"}
                    value={newModel.maxTokens}
                  />
                </NumberInput>

                <FormLabel>Top P</FormLabel>
                <NumberInput>
                  <NumberInputField
                    onChange={updateFloat}
                    name={"topP"}
                    value={newModel.topP}
                  />
                </NumberInput>

                <FormLabel>Presence Penalty</FormLabel>
                <NumberInput>
                  <NumberInputField
                    onChange={updateFloat}
                    name={"presence_pen"}
                    value={newModel.presence_pen}
                  />
                </NumberInput>

                <FormLabel>Frequency Penalty</FormLabel>
                <NumberInput>
                  <NumberInputField
                    onChange={updateFloat}
                    name={"freq_pen"}
                    value={newModel.freq_pen}
                  />
                </NumberInput>
              </FormControl>
            </Stack>
          </Box>
          <Box>
            <HStack spacing={3}>
              <Button
                colorScheme={"green"}
                onClick={() => {
                  if (isValid(newModel)) {
                    onClose();
                    createModel();
                    setNewModel({
                      name: "",
                      model: "",
                      prompt: "",
                      temperature: 0,
                      maxTokens: 0,
                      topP: 0.0,
                      presence_pen: 0.0,
                      freq_pen: 0.0,
                    });
                  } else {
                    // console.log("Invalid Model!");
                  }
                }}
              >
                Create Model
              </Button>
              <Button
                colorScheme={"blue"}
                onClick={() => {
                  onClose();
                  setNewModel({
                    name: "",
                    model: "",
                    prompt: "",
                    temperature: 0,
                    maxTokens: 0,
                    topP: 0.0,
                    presence_pen: 0.0,
                    freq_pen: 0.0,
                  });
                }}
              >
                Close
              </Button>
            </HStack>
          </Box>
        </Box>
      </Box>
      <ErrorDrawer error={error} isOpen={isErrOpen} onClose={onErrClose} />
    </>
  );
};

export default ModelCreator;
