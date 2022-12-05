import { 
    Button,
    Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, ModalOverlay,
    FormControl, FormLabel, FormHelperText,
    RadioGroup, Radio,
    Divider,
    useDisclosure,
    Input,
    HStack
} from "@chakra-ui/react"

const CourseCreator = () => {
    const { isOpen, onOpen, onClose} = useDisclosure();

    return (
        <>
        <Button style={{backgroundColor: '#2C54A7', color: 'white'}} fontSize={'sm'} onClick={onOpen}>
            Create New Course
        </Button>
            <Modal isOpen={isOpen} onClose={onClose} >
            <ModalOverlay/>
            <ModalContent>
                <ModalHeader>
                    Course Creator
                </ModalHeader>
    
                <Divider/>
                <ModalBody>
                    <FormControl isRequired>
                        <FormLabel>Course Code</FormLabel>
                        <Input type='email' />
                        <FormHelperText>Example: CSC108H5</FormHelperText>

                        <FormLabel mt={4}>Course Name</FormLabel>
                        <Input type='email' />
                        <FormHelperText>Example: Introduction to Computer Programming</FormHelperText>

                        <FormLabel as='legend' mt={4}>Session</FormLabel>
                        <RadioGroup defaultValue='Fall'>
                            <HStack spacing='24px'>
                            <Radio value='Fall'>Fall</Radio>
                            <Radio value='Winter'>Winter</Radio>
                            <Radio value='Full Year'>Full Year</Radio>
                            <Radio value='Summer'>Summer</Radio>
                            </HStack>
                        </RadioGroup>
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

export default CourseCreator