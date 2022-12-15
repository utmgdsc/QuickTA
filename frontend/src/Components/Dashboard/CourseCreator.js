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
import {Temporal} from "@js-temporal/polyfill";
import {useState} from "react";
import axios from "axios";
const CourseCreator = () => {
    const { isOpen, onOpen, onClose} = useDisclosure();
    const [newCourse, setNewCourse] = useState({
        course_code: "",
        course_name: ""
    });
    const [semester, setNewSemester] = useState(Temporal.Now.plainDateISO().toString().substring(2,4)+'F');

    function updateField(e){
        setNewCourse({
            ...newCourse,
            [e.target.name]: e.target.value
        });
        console.log(newCourse);
    }

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
                        <Input type='email' name={"course_code"} onChange={updateField}/>
                        <FormHelperText>Example: CSC108H5</FormHelperText>

                        <FormLabel mt={4}>Course Name</FormLabel>
                        <Input type='email' name={"course_name"} onChange={updateField}/>
                        <FormHelperText>Example: Introduction to Computer Programming</FormHelperText>

                        <FormLabel as='legend' mt={4}>Session</FormLabel>
                        <RadioGroup value={semester} onChange={setNewSemester} name={"semester"}>
                            <HStack spacing='24px'>
                            <Radio value={Temporal.Now.plainDateISO().toString().substring(2,4)+'F'}>Fall</Radio>
                            <Radio value={Temporal.Now.plainDateISO().toString().substring(2,4)+'W'}>Winter</Radio>
                            <Radio value={Temporal.Now.plainDateISO().toString().substring(2,4)+'Y'}>Full Year</Radio>
                            <Radio value={Temporal.Now.plainDateISO().toString().substring(2,4)+'S'}>Summer</Radio>
                            </HStack>
                        </RadioGroup>
                    </FormControl>
                </ModalBody>
                <Divider mt={4}/>

                <ModalFooter>
                    <Button
                      backgroundColor="#3278cd"
                      marginRight="1vw"
                      color="white"
                      colorScheme="blue"
                      onClick={async () => {
                          if (newCourse.course_code.length > 0 && newCourse.course_name.length > 0){
                              console.log(newCourse.course_code, newCourse.course_name, semester);
                              await axios.post(process.env.REACT_APP_API_URL + "/course", {
                                  course_code: newCourse.course_code,
                                  semester: semester,
                                  course_name: newCourse.course_name
                              })
                                .then(async (res) => {
                                    await axios.post(process.env.REACT_APP_API_URL + "/researcher/gptmodel-create", {
                                        model_name: newCourse.course_code,
                                        engine: "text-davinci-002",
                                        temperature: 0.9,
                                        max_tokens: 300,
                                        top_p: 1,
                                        frequency_penalty: 0,
                                        presence_penalty: 0.6
                                    })
                                      .then((res) => {})
                                      .catch((err) => console.log(err))
                                })
                                .catch((err) => console.log(err))
                          }setNewCourse({course_code: "", course_name: ""});
                          setNewSemester(Temporal.Now.plainDateISO().toString().substring(2,4)+'F');
                          onClose();
                      }}
                    >
                    Confirm
                    </Button>
                    <Button onClick={() => {
                        setNewCourse({course_code: "", course_name: ""});
                        setNewSemester(Temporal.Now.plainDateISO().toString().substring(2, 4) + 'F');
                        onClose();
                    }} backgroundColor="#EFEFEF" color="#2D2D2D" >
                    Cancel
                    </Button>
                </ModalFooter>
            </ModalContent>
            </Modal>
        </>
    );
}

export default CourseCreator