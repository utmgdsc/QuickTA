import {Button, HStack, Modal, ModalBody, ModalFooter, ModalOverlay, RadioGroup, Textarea, VStack, useDisclosure} from "@chakra-ui/react";


const PostQuestions = ({ isOpen, onClose }) => {
    
    const {isOpen: isPromptOpen, onOpen: onPromptOpen, onClose: onPromptClose} = useDisclosure();
    const {isOpen: isErrOpen, onOpen: onErrOpen, onClose: onErrClose} = useDisclosure();
    const [error, setError] = useState();
    const [questions, setQuestions] = useState([]);
    const [choices, setChoices] = useState([]);
    const [optionsSelected, setOptionsSelected] = useState({prompt: ""});
    const [promptQuestion, setPromptQuestion] = useState("");

    const fetchQuestions = () => {
        axios.get()
            .then((res) => {
                setQuestions(res.data.questions);
                setChoices(res.data.questions.map((question, index) => {
                    axios.get()
                    .then((res) => {
                        return res.data.choices;
                    })
                    .catch((err) =>{
                        setError(err);
                        onErrOpen();
                    })
                }));

                // fetch prompt question here
                axios.get()
                    .then((res) => {
                        setPromptQuestion(res.data.question);
                    })
                    .catch((err) => {
                        setError(err);
                        onErrOpen();
                    })
            })
            .catch((err) => {
                setError(err);
                onErrOpen();
            })
    }

    const submitResponse = () => {
        axios.post()
        .then((res) => {})
        .catch((err) => {
            setError(err);
            onErrOpen();
        })
    }

    return(
        <>
            <Modal closeOnOverlayClick={false} isOpen={isOpen} onClose={onClose}>
                <ModalOverlay/>
                <ModalContent>
                    <ModalHeader>
                        <span style={{
                            fontFamily: "Poppins"
                        }}>Post Questions</span>
                    </ModalHeader>
                    <ModalBody>
                        <VStack>
                        {questions.map((question, index) => (
                            <>
                            <Text>{question.text}</Text>
                            <RadioGroup>
                                <HStack>
                                    {choices[index].map((choice, index) => (
                                        <Radio value={choice.value} onChange={(e) => {setOptionsSelected({...optionsSelected, [question.text]: e.target.value})}}>{choice.text}</Radio>
                                    ))}
                                </HStack>
                            </RadioGroup>
                            </>
                        ))}
                        </VStack>
                    </ModalBody>
                    <ModalFooter>
                        <Button
                        onClick={() => {
                            if(_){ // verify that all questions have been answered
                                onPromptOpen();
                            }else{
                                console.log("Please answer all questions");
                            }
                        }}>
                            Next
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>

            <Modal isOpen={isPromptOpen} onClose={onPromptClose}>
                <ModalOverlay/>
                <ModalContent>
                    <ModalHeader>
                    <span style={{
                        fontFamily: "Poppins"
                    }}>Open Ended Response
                    </span>
                    <span style={{
                        fontFamily: "Poppins"
                    }}></span>
                    </ModalHeader>
                    <ModalContent>
                        <Textarea name={"prompt"} placeholder={"Enter your response here"} onChange={(e) =>{
                            setOptionsSelected({...optionsSelected, [e.target.name]: e.target.value});
                        }}></Textarea>
                    </ModalContent>
                </ModalContent>
                <ModalFooter>
                    <Button
                    onClick={() => {
                        if(optionsSelected.prompt === ""){
                            console.log("Please enter a response");
                        }else{
                            onPromptClose();
                            submitResponse();
                        }
                    }}></Button>
                </ModalFooter>
            </Modal>
        </>
    );

}

export default PostQuestions;