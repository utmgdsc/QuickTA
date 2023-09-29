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
  FormHelperText,
  Divider,
  Select,
  useDisclosure,
  Input,
  Box,
  Heading,
  Stack,
  HStack,
} from "@chakra-ui/react";
import { useState } from "react";
import axios from "axios";
import ErrorDrawer from "../ErrorDrawer";

const ModelRemover = ({ courseid, deleting, setDeleting, allModels }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [removeModel, setRemoveModel] = useState({
    id: "",
  });
  const {
    isOpen: isErrOpen,
    onOpen: onErrOpen,
    onClose: onErrClose,
  } = useDisclosure();
  const [error, setError] = useState();
  function updateField(e) {
    setRemoveModel({
      ...removeModel,
      [e.target.name]: e.target.value,
    });
  }

  function isValid(obj) {
    for (const [key, value] of Object.entries(obj)) {
      if (["id"].includes(key.toString())) {
        if (value.length <= 0) {
          return false;
        }
      }
    }
    return true;
  }

  const deleteModel = async () => {
    setDeleting(true);
    await axios
      .delete(
        process.env.REACT_APP_API_URL +
          `/models/gpt?course_id=${courseid}&model_name=${removeModel.id}`
      )
      .then((res) => {
        console.log(res);
      })
      .catch((err) => {
        setError(err);
        console.log(err);
        onErrOpen();
      });
    setDeleting(false);
  };

  const isActive = async (modelid) => {
    return await axios
      .post(
        process.env.REACT_APP_API_URL +
          `/models/gpt?model_id=${modelid}&course_id=${courseid}`
      )
      .then((res) => res.data.status)
      .catch((err) => {
        setDeleting(false);
        setError(err);
        console.log(err);
        onErrOpen();
      });
  };

  return (
    <>
      <Box p="5px">
        <Button
          colorScheme="red"
          isDisabled={deleting || allModels.length <= 1}
          onClick={onOpen}
        >
          Delete
        </Button>
      </Box>

      <Modal isOpen={isOpen} onClose={onClose} closeOnOverlayClick={false}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            <Heading size={"lg"}>Delete Model</Heading>
          </ModalHeader>
          <ModalBody>
            <Stack spacing={2}>
              <FormControl id={"Required Parameters"} isRequired>
                <FormLabel>Model Name</FormLabel>
                <Select
                  placeholder="Select a model to delete"
                  onChange={(e) => {
                    setRemoveModel({ id: e.target.value });
                  }}
                  value={removeModel.id}
                >
                  <option
                    label="-----------------------------"
                    value={""}
                    disabled
                  />
                  {allModels.map((model, key) => (
                    <option key={key} value={model.model_name}>
                      {model.model_name}
                    </option>
                  ))}
                </Select>
              </FormControl>
            </Stack>
          </ModalBody>
          <ModalFooter>
            <HStack spacing={3}>
              <Button
                colorScheme={"red"}
                onClick={() => {
                  if (isValid(removeModel)) {
                    onClose();
                    deleteModel();
                    setRemoveModel({ id: "" });
                  }
                }}
              >
                Delete Model
              </Button>
              <Button
                colorScheme={"blue"}
                onClick={() => {
                  onClose();
                  setRemoveModel({ id: "" });
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

export default ModelRemover;
