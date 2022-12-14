import {
  Button,
  Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, ModalOverlay,
  FormControl, FormLabel, FormHelperText,
  Divider,
  useDisclosure,
  Input,
  Box, Heading, Stack, HStack
} from "@chakra-ui/react"
import {useState} from "react";
import axios from "axios";

const ModelRemover = ({courseid, deleting, setDeleting}) => {
  const {isOpen, onOpen, onClose} = useDisclosure();
  const [removeModel, setRemoveModel] = useState({
    id: "",
  });

  function updateField(e){
    setRemoveModel({
      ...removeModel,
      [e.target.name]: e.target.value
    });
  }

  function isValid(obj){
    for(const [key, value] of Object.entries(obj)){
      if (["id"].includes(key.toString())){
        if (value.length <= 0){return false}
      }
    }return true
  }

  const deleteModel = async () => {
    setDeleting(true);
    await axios.post(process.env.REACT_APP_API_URL + "/researcher/gptmodel-delete", {
      course_id: courseid,
      model_id: removeModel.id,
    })
      .then((res) => {setDeleting(false);})
      .catch((err) => console.log(err))
  }

  return (
    <>
      <Box p='5px'><Button colorScheme='red' isDisabled={deleting} onClick={onOpen}>Delete</Button></Box>

      <Modal isOpen={isOpen} onClose={onClose} closeOnOverlayClick={false}>
        <ModalOverlay/>
        <ModalContent>
          <ModalHeader>
            <Heading size={'lg'}>Delete Model</Heading>
          </ModalHeader>
          <ModalBody>
            <Stack spacing={2}>
              <FormControl id={"Required Parameters"} isRequired>
                <FormLabel>Model ID</FormLabel>
                <Input onChange={updateField}
                       value={removeModel.id}
                       name={"id"}/>
              </FormControl>
            </Stack>
          </ModalBody>
          <ModalFooter>
            <HStack spacing={3}>
              <Button colorScheme={'red'} onClick={() => {
                if(isValid(removeModel)){
                  onClose();
                  deleteModel();
                  setRemoveModel({id : ""})
                }
              }}>
                Delete Model
              </Button>
              <Button colorScheme={'blue'} onClick={() => {
                onClose();
                setRemoveModel({id: ""});
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

export default ModelRemover;