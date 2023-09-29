import {
    Button, 
    HStack, 
    Modal, 
    ModalBody, 
    ModalFooter, 
    ModalOverlay, 
    RadioGroup, 
    Textarea, 
    VStack, 
    useDisclosure,
    Radio,
    Text,
    ModalContent,
    ModalHeader,
} from "@chakra-ui/react";
import axios from "axios";
import { useState } from "react";
import ErrorDrawer from "../ErrorDrawer";

const PostQuestions = ({ isOpen, onClose }) => {
    
    const {isOpen: isPromptOpen, onOpen: onPromptOpen, onClose: onPromptClose} = useDisclosure();
    const {isOpen: isErrOpen, onOpen: onErrOpen, onClose: onErrClose} = useDisclosure();
    const [error, setError] = useState();
    const [questions, setQuestions] = useState([{}]);
    const [optionsSelected, setOptionsSelected] = useState([{}]);
    const [scaleSurveyId, setScaleSurveyId] = useState("");
    const [open_ended_surveyId, setOpenEndedSurveyId] = useState("");

    const fetchQuestions = () => {
        axios.get(process.env.REACT_APP_API_URL + '/survey/details?survey_id=1d26169c-aad0-41e3-b74b-30d6511a56f0')
            .then((res) => {
                setQuestions(res.data.questions);
                setScaleSurveyId(res.data.survey_id);
                // fetch prompt question here
                axios.get(process.env.REACT_APP_API_URL + '/survey/details?survey_id=428964a0-2ac5-4669-b8d8-2cc48927fb1d')
                    .then((res) => {
                        setQuestions([...questions, res.data.questions]);
                        setOpenEndedSurveyId(res.data.survey_id);
                    })
                    .catch((err) => {
                        setError("Error fetching prompt question");
                        onErrOpen();
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
        let allResponses = [];
        for(let i = 0; i < optionsSelected.length; i++){
            let data = {};
            
            data[utorid] = UTORid;
            data[question_type] = optionsSelected[i][question_type];
            data[conversation_id] = conversation_id;
            data[question_id] = optionsSelected[i][question_id];
            data[survey_type] = "Post";

            if (data[question_type] === "SCALE"){
                data[answer] = optionsSelected[i][answer];
                data[survey_id] = scaleSurveyId;
            }else if(data[question_type] === "OPEN_ENDED"){
                data[open_ended_answer] = optionsSelected[i][open_ended_answer];
                data[survey_id] = open_ended_surveyId;
            }

            allResponses.push(data);
        }
        axios.post(process.env.REACT_APP_API_URL + '/survey/questions/answer', allResponses)
        .then((res) => {
            console.log("Successfully submitted response!");
        })
        .catch((err) => {
            setError(err);
            onErrOpen();
        })
    }

    const checkValidResponse = () => {
        
        for(let i = 0; i < questions.length; i++){
            if((optionsSelected[questions[i].question_type] === "OPEN_ENDED" && optionsSelected[questions[i].open_ended_answer] === "") ||
            (optionsSelected[questions[i].question_type] === "SCALE" && optionsSelected[questions[i].answer] <= 0)){
                return false;
            }
        }
        return true;

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
                            console.log("Submit button clicked");
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
            <ErrorDrawer isOpen={isErrOpen} onClose={onErrClose} error={error}/>
        </>
    );

}

export default PostQuestions;