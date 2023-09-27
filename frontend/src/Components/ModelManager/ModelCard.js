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
  FormControl,
  Heading,
  Stack,
  Input,
  ModalFooter,
  ModalCloseButton,
  HStack,
  Divider,
  NumberInput,
  NumberInputField,
  Textarea,
  VStack,
} from "@chakra-ui/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import axios from "axios";
import ErrorDrawer from "../ErrorDrawer";

const ModelCard = ({
  modelName,
  colorScheme,
  modelId,
  courseid,
  modelStatus,
  setCurrentModel,
  setEnabling,
  enabling,
}) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [newModelSettings, setModelSettings] = useState({
    name: "",
    model: "",
    prompt: "",
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
    setModelSettings({
      ...newModelSettings,
      [e.target.name]: e.target.value,
    });
  }

  function isValid(obj) {
    for (const [key, value] of Object.entries(obj)) {
      if (["name", "model", "prompt"].includes(key)) {
        if (value.length <= 0) {
          return false;
        }
      } else if (key === "maxTokens") {
        if (isNaN(parseInt(value)) || value < 0) {
          return false;
        }
      } else {
        if (isNaN(parseFloat(value)) || value < 0) {
          return false;
        }
      }
    }
    return true;
  }

  const updateModel = async () => {
    setEnabling(true);
    await axios
      .patch(
        process.env.REACT_APP_API_URL + `/models/gpt?model_id=${modelId}`,
        {
          model_name: newModelSettings.name,
          model: newModelSettings.model,
          prompt: newModelSettings.prompt,
          max_tokens: newModelSettings.maxTokens,
          top_p: newModelSettings.topP,
          presence_penalty: newModelSettings.presence_pen,
          frequency_penalty: newModelSettings.freq_pen,
          temperature: newModelSettings.temperature,
        }
      )
      .then((res) => {
        setEnabling(false);
      })
      .catch((err) => {
        setError(err);
        onErrOpen();
      });
  };

  const enableModel = async () => {
    setEnabling(true);
    await axios
      .get(
        process.env.REACT_APP_API_URL +
          `/models/gpt/activate?course_id=${courseid}&model_id=${modelId}`
      )
      .then((res) => {
        setCurrentModel(modelId);
        setEnabling(false);
      })
      .catch((err) => {
        setError(err);
        onErrOpen();
      });
  };

  const fetchModelDetails = async () => {
    return await axios
      .get(process.env.REACT_APP_API_URL + `/models/gpt?model_id=${modelId}`)
      .then((res) => {
        const model_settings = res.data;
        setModelSettings({
          name: model_settings.model_name,
          model: model_settings.model,
          prompt: model_settings.prompt,
          maxTokens: model_settings.max_tokens,
          topP: model_settings.top_p,
          presence_pen: model_settings.presence_penalty,
          freq_pen: model_settings.frequency_penalty,
          temperature: model_settings.temperature,
        });
        console.log(res.data.max_tokens);
      })
      .catch((err) => {
        setError(err);
        onErrOpen();
      });
  };

  return (
    <>
      <Button
        colorScheme={colorScheme}
        boxSizing="border-box"
        p="10px"
        onClick={() => {
          onOpen();
          fetchModelDetails();
        }}
        isDisabled={enabling}
      >
        <Box borderBottom="2px" pb="5px">
          <Flex>
            <Text size="lg" fontWeight="500">
              {modelName}
            </Text>
          </Flex>
        </Box>
      </Button>

      <Modal
        isOpen={isOpen}
        onClose={onClose}
        closeOnOverlayClick={false}
        scrollBehavior="inside"
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            <Heading size={"lg"} style={{ paddingBottom: "8px" }}>
              {modelName}
            </Heading>
            <HStack style={{ margin: 0, padding: 0 }}>
              <p>Enable Model:</p>
              <Switch
                id="model-status"
                defaultChecked={modelStatus}
                isReadOnly={modelStatus}
                onChange={() => {
                  enableModel();
                  onClose();
                }}
              />
            </HStack>
          </ModalHeader>
          <ModalBody>
            <Divider />

            <Stack spacing={2}>
              <FormControl id={"Required Parameters"} isRequired>
                <FormLabel>Name</FormLabel>
                <Input
                  onChange={updateField}
                  value={newModelSettings.name}
                  name={"name"}
                />

                <FormLabel>Model</FormLabel>
                <Input
                  onChange={updateField}
                  value={newModelSettings.model}
                  name={"model"}
                />

                <FormLabel>Prompt</FormLabel>
                <Textarea
                  onChange={updateField}
                  value={newModelSettings.prompt}
                  name={"prompt"}
                  style={{ minHeight: "320px" }}
                />
              </FormControl>

              <FormControl id={"Optional Parameters"}>
                <FormLabel>Max Tokens</FormLabel>
                <Input
                  onChange={updateField}
                  name={"maxTokens"}
                  value={newModelSettings.maxTokens}
                />

                <FormLabel>Top P</FormLabel>
                <Input
                  onChange={updateField}
                  value={newModelSettings.topP}
                  name={"topP"}
                />

                <FormLabel>Presence Penalty</FormLabel>
                <Input
                  onChange={updateField}
                  value={newModelSettings.presence_pen}
                  name={"presence_pen"}
                />

                <FormLabel>Frequency Penalty</FormLabel>
                <Input
                  onChange={updateField}
                  value={newModelSettings.freq_pen}
                  name={"freq_pen"}
                />

                <FormLabel>Temperature</FormLabel>
                <Input
                  onChange={updateField}
                  value={newModelSettings.temperature}
                  name={"temperature"}
                />
              </FormControl>
            </Stack>
          </ModalBody>
          <ModalFooter>
            <HStack spacing={3}>
              <Button
                colorScheme={"green"}
                onClick={() => {
                  if (isValid(newModelSettings)) {
                    onClose();
                    updateModel();
                    setModelSettings({
                      name: "",
                      model: "",
                      prompt: "",
                      maxTokens: 0,
                      topP: 0.0,
                      presence_pen: 0.0,
                      freq_pen: 0.0,
                    });
                  }
                }}
              >
                Submit Edits
              </Button>
              <Button
                colorScheme={"blue"}
                onClick={() => {
                  onClose();
                  setModelSettings({
                    name: "",
                    model: "",
                    prompt: "",
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
          </ModalFooter>
        </ModalContent>
      </Modal>
      <ErrorDrawer error={error} isOpen={isErrOpen} onClose={onErrClose} />
    </>
  );
};

export default ModelCard;
