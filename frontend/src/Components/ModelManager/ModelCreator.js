import { 
    Button,
    Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, ModalOverlay,
    FormControl, FormLabel, FormHelperText,
    Divider,
    useDisclosure,
    Input,
    Box
} from "@chakra-ui/react"

const ModelCreator = () => {
    const { isOpen, onOpen, onClose} = useDisclosure();

    return (
        <>
        <Box p='5px'><Button colorScheme='teal' onClick={onOpen}>Create/Edit</Button></Box>
        <Modal isOpen={isOpen} onClose={onClose} >
        <ModalOverlay/>
        <ModalContent>
            <ModalHeader>
                Model Creator/Editor
            </ModalHeader>

            <Divider/>
            <ModalBody>
                <FormControl isRequired>
                    <FormLabel>Model Name</FormLabel>
                    <Input type='email' />
                    <FormHelperText>Example: GBT-3</FormHelperText>

                    <FormLabel mt={4}>Model ID</FormLabel>
                    <Input type='email' />
                    <FormHelperText>Available models:</FormHelperText>
                    <FormHelperText>GBT-3 (21341234)</FormHelperText>

                    <FormLabel mt={4}>Prompt</FormLabel>
                    <Input type='email' />
                    <FormHelperText>Example: You are an instructor for a course...</FormHelperText>
                </FormControl>

                <FormControl>
                    <FormLabel mt={4}>Max Tokens</FormLabel>
                    <Input type='email' />
                    <FormHelperText>Maximum number of tokens to generate text.</FormHelperText>
                    <FormHelperText>(Default = 16)</FormHelperText>

                    <FormLabel mt={4}>Temperature</FormLabel>
                    <Input type='email' />
                    <FormHelperText>Sampling temperature; higher values means the model will take more risks.</FormHelperText>
                    <FormHelperText>(Default = 1)</FormHelperText>
                </FormControl>
            </ModalBody>
            <Divider mt={4}/>

            <ModalFooter>
                <Button backgroundColor="#3278cd" marginRight="1vw" color="white" colorScheme="blue">
                Confirm
                </Button>
                <Button onClick={onClose} backgroundColor="#EFEFEF" color="#2D2D2D" >
                Cancel
                </Button>
            </ModalFooter>
        </ModalContent>
        </Modal>
        </>
    );
}

export default ModelCreator