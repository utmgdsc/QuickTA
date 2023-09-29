import {
  Box,
  Button, Modal, ModalBody, ModalContent, ModalFooter,
  ModalHeader,
  ModalOverlay, Radio, RadioGroup,
  useDisclosure, VStack,
  Text,
} from '@chakra-ui/react';
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import React, {useEffect, useState} from "react";
import axios from "axios";
import ErrorDrawer from "../ErrorDrawer";
import PostQuestions from "./PostQuestions";

const TechAssessment = ({ isOpen, onClose, conversation_id, updateConvoID, updateInConvo, updateMessages, UTORid }) => {

  const {isOpen: isErrOpen, onOpen: onErrOpen, onClose: onErrClose} = useDisclosure();
  const {isOpen: isPostQOpen, onOpen: onPostQOpen, onClose: onPostQClose} = useDisclosure();
  const [error, setError] = useState();
  const [code, setCode] = useState({question: "", language: ""});
  const [options, setOptions] = useState([]);
  const [studentResponse, setStudentResponse] = useState(null);
  const [answer, setAnswer] = useState("");
  const [displayAnswer, setDisplayAnswer] = useState(false);
  const [answerFlavorText, setAnswerFlavorText] = useState("");
  const [assessement_question_id, setAssessmentQuestionID] = useState("");
  const [disableAll, setDisableAll] = useState(false);

  // Fetch code, questions, and answer for tech assessment
  const fetchCodeQuestion = () => {
    axios.get(process.env.REACT_APP_API_URL + '/assessment/question/random?assessment_id=8dd15ed3-da48-487b-82ac-6c2ae12f93b6')
        .then((res) => {
          setCode({question: res.data.question, language: res.data.language});
          setOptions(res.data.choices);
          setAnswer(res.data.correct_answer);
          setAnswerFlavorText(res.data.correct_answer_flavor_text);
          setAssessmentQuestionID(res.data.assessment_question_id);
          console.log(res.data.choices);
        })
        .catch((err) => {
          setError(err);
          onErrOpen();
        })
  }

  useEffect(() => {
    fetchCodeQuestion();
  }, [UTORid]);

  return (
    <>
    <Modal closeOnOverlayClick={false} isOpen={isOpen} onClose={onClose}>
      <ModalOverlay/>
      <ModalContent>
        <ModalHeader>
          <span style={{
            fontFamily: "Poppins"
          }}>Technical Assessment
        </span>
        </ModalHeader>
        <ModalBody>
          <VStack>
            <Box width={'100%'} m={5} p={3}>
              <SyntaxHighlighter
                showLineNumbers={true}
                wrapLongLines={true}
                language={"python"}
                codeTagProps={{ style: { fontSize: "12px" } }}
              >
                {code.question}
              </SyntaxHighlighter>
            </Box>
            <RadioGroup
            display="grid"
            gridGap={4}>
              {options.map((element) => 
              (
              <Button
                isDisabled={disableAll} onClick={(e) => {
                  setStudentResponse(element.choice);
                  console.log(`Student reponse: ${element.choice}`);
                }}
                style={{
                  justifyContent: "left",
                }}
                >
                <Text margins={2}>{element.flavor_text}</Text>
              </Button>                
              ))}
            </RadioGroup>
          </VStack>
        </ModalBody>

        <ModalFooter
          style={{
            display: "flex",
          }}
        >
        { displayAnswer ? <Text mx={10} color={'green'}>{answerFlavorText}</Text> : null }
        <Button
        isDisabled={studentResponse === null || disableAll}
        onClick={() => {
            console.log("Here")
            //Display Flavor Text
            setDisableAll(true);
            
            axios.post(process.env.REACT_APP_API_URL + '/assessment/question/answer', {
              utorid: UTORid,
              conversation_id: conversation_id,
              assessment_question_id: assessement_question_id,
              answer: studentResponse
            })
            .then((res) => {
              console.log(res);
            })
            .catch((err) => {
              setError(err);
              onErrOpen();
            })
            setDisplayAnswer(true);
            setTimeout(() => {
              onClose();
              onPostQOpen();
            }, 5000);
            
            console.log("Submitted answer");
        
        }}>
          Next
        </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
    <PostQuestions isOpen={isPostQOpen} onClose={onPostQClose}/>
    <ErrorDrawer error={error} isOpen={isErrOpen} onClose={onErrClose}/>
  </>
  )
}

export default TechAssessment;