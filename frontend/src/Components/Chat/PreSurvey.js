import { Modal, VStack } from "@chakra-ui/react";
import axios from "axios";
import { useEffect, useState } from "react";
import { ModalBody, ModalContent, ModalHeader, ModalOverlay, ModalFooter } from "@chakra-ui/modal";
import { Radio, RadioGroup } from "@chakra-ui/radio";
import { HStack } from "@chakra-ui/layout";
import { useDisclosure } from "@chakra-ui/hooks";
import { Button } from "@chakra-ui/button";
import ErrorDrawer from "../ErrorDrawer";

const PreSurvey = ({ isOpen, onClose, UTORid, setDisableAll }) => {
  const [questions, setQuestions] = useState([{}]); // [ {question: "", options: []}, ... ]
  const [surveyID, setSurveyID] = useState("");
  const [studentResponse, setStudentResponse] = useState([]);
  const {
    isOpen: isErrOpen,
    onOpen: onErrOpen,
    onClose: onErrClose,
  } = useDisclosure();
  const [error, setError] = useState();

  const fetchPreSurvey = () => {
    axios
      .get(
        process.env.REACT_APP_API_URL +
          "/survey/details?survey_id=d18676a6-4419-4ae6-beda-97bc26377942"
      )
      .then((res) => {
        setQuestions(res.data.questions);
        setSurveyID(res.data.survey_id);
      })
      .catch((err) => {
        setError(err);
        onErrOpen();
      });
  };

  const checkValidResponse = () => {
    for (let i = 0; i < questions.length; i++) {
      if (
        ((studentResponse[questions[i].question_type] === "OPEN_ENDED" || 
        studentResponse[questions[i].question_type] === "MULTIPLE_CHOICE") &&
        studentResponse[questions[i].answer] <= 0)
      ) {
        return false;
      }
    }
    return true;
  };

  const submitResponse = () => {
    let allResponses = [];
    for (let i = 0; i < studentResponse.length; i++) {
      let data = {
        utorid: UTORid,
        question_type: studentResponse[i].question_type,
        question_id: studentResponse[i].question_id,
        survey_type: "Pre",
        survey_id: surveyID,
        answer: studentResponse[i].answer,
      };
      allResponses.push(data);
    }
    if(checkValidResponse() === false){
      console.log("invalid response");
    }else{
      console.log("here");
      axios
      .post(
        process.env.REACT_APP_API_URL + "/survey/questions/answer",
        allResponses
      )
      .then((res) => {
        console.log(`Successfully submitted pre-survey`);
      })
      .catch((err) => {
        setError(err);
        console.log(err);
        onErrOpen();
      });
      setDisableAll(false);
    }
    
  };
  useEffect(()=>{
    setDisableAll(true);
    fetchPreSurvey();
  }, UTORid);

  return (
    <>
    <Modal 
    isOpen={isOpen} 
    onClose={onClose}
    scrollBehavior="inside"
    size={"3xl"}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
            <span
              style={{
                fontFamily: "Poppins",
              }}
            >
              Pre-Survey
            </span>
        </ModalHeader>
        <ModalBody>
            <VStack>
              {questions.map((question, question_idx) => (
                <VStack>
                  <div
                    style={{
                      fontSize: "14px",
                    }}
                  >
                    {question_idx + 1 + "."} {question.question}
                  </div>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      margin: "30px 0px",
                    }}
                  >
                    <div className="scale-question">
                      <RadioGroup
                        onChange={(value) => {
                          setStudentResponse({
                            ...studentResponse,
                            [question_idx + 1]: value,
                          });console.log(studentResponse);
                        }}
                        value={parseInt(studentResponse[question_idx + 1])}
                        display="grid"
                        gridGap={4}
                      >
                        <HStack direction="row" spacing={20}>
                          {question.answers &&
                            question.answers.map((answer, answer_idx) => {
                              return (
                                <div key={answer_idx} className="answer-option">
                                  <label>
                                    <div className="answer-pretext">
                                      {answer.value}
                                    </div>
                                    <Radio value={answer.value} />
                                    <div className="answer-posttext">
                                      {answer.text}
                                    </div>
                                  </label>
                                </div>
                              );
                            })}
                        </HStack>
                      </RadioGroup>
                    </div>
                  </div>
                </VStack>
              ))}
            </VStack>
        </ModalBody>
      
      <ModalFooter>
        <Button onClick={() =>{
          onClose(); 
          setDisableAll(false);
          submitResponse();
          }}>
          Done
        </Button>
      </ModalFooter>
      </ModalContent>
    </Modal>
    <ErrorDrawer isOpen={isErrOpen} onClose={onErrClose} error={error} />
    </>
  );
};

export default PreSurvey;
