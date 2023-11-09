import {
  Button,
  Spacer,
  HStack,
  RadioGroup,
  Textarea,
  VStack,
  Text,
} from "@chakra-ui/react";
import axios from "axios";
import { useEffect, useState } from "react";
import { Temporal } from "@js-temporal/polyfill";
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import { Flex } from "@chakra-ui/layout";
import { Spinner } from "@chakra-ui/react";



const PostQuestions = ({
  isPostQOpen,
  setIsPostQOpen,
  setDisableAll,
  updateMessages,
  updateInConvo,
  updateConvoID,
  conversations,
  conversation_id,
  setConversations,
  UTORid,
  setDisableAllOption,
  currModelDefaultMessage,
  resetTechAssessment
}) => {

  const [questions, setQuestions] = useState([]);
  const [currQuestion, setCurrQuestion] = useState(0);
  const [studentResponse, setStudentResponse] = useState([]);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [surveyID, setSurveyID] = useState("");

  /** Fetch survey questions from backend. */
  const fetchSurveyQuestions = () => {
    setIsLoading(true);
    axios
      .get( process.env.REACT_APP_API_URL + "/survey/v2/questions",
          { 
            params: { 
            conversation_id: conversation_id,
            type: "Post",
          }}
      )
      .then((res) => {
        // console.log(res.data);
        setQuestions(res.data.questions);
        setSurveyID(res.data.survey_id);
        
        // Get number of questions & set student response as empty
        let numQuestions = res.data.questions.length;
        let _studentResponse = {}
        for (let i = 0; i < numQuestions; i++) {
          _studentResponse[i + 1] = "";
        }
        setStudentResponse(_studentResponse);
        setIsLoading(false);
      })
      .catch((err) => {
        setIsLoading(false);
      });
  };

  /**
   * Checks if all questions are answered.
   * @returns true if all questions are answered, false otherwise.
   */
  const checkValidResponse = () => {
    for (let i = 0; i < questions.length; i++) {
      if (
        (studentResponse[questions[i].question_type] === "OPEN_ENDED" ||
          studentResponse[questions[i].question_type] === "MULTIPLE_CHOICE") &&
        studentResponse[questions[i].answer] <= 0
      ) {
        return false;
      }
    }
    return true;
  };

  /**
   * Submits student response to backend.
   */
  const submitResponse = () => {
    setIsSubmitting(true);
    let allResponses = [];
    
    for (var response in studentResponse) {
      let data = {
        utorid: UTORid,
        question_type: questions[response - 1].question_type,
        question_id: questions[response - 1].question_id,
        conversation_id: conversation_id,
        survey_type: "Post",
        survey_id: surveyID,
        answer: studentResponse[response],
      };
      allResponses.push(data);
    }

    if (checkValidResponse() === false) {
      // console.log("invalid response");
    } else {
      // Indicate loading
      setDisableAll({
        endChat: true,
        newConversation: true,
        sendButton: true,
        inputMessage: true,
        oldConvoButtons: false,
      });

      axios
        .post(process.env.REACT_APP_API_URL + "/survey/questions/answer", allResponses)
        .then((res) => {          
          // Reset Post Questions & Tech Assessment for next iteration
          setStudentResponse([]);
          setCurrQuestion(0);
          setDisableAllOption(false);
          setIsSubmitting(false);
          
          resetTechAssessment();
          
          // find and update current conversation
          let currConvo = conversations.find((convo) => convo.conversation_id === conversation_id);
          let newConversations = [
              { ...currConvo, status: "I" },
              ...conversations.filter((convo) => convo.conversation_id !== conversation_id),
          ];
          setConversations(newConversations);

          updateInConvo(false);
          updateConvoID("");
          updateMessages([
            {
              message: currModelDefaultMessage,
              dateSent: Temporal.Now.zonedDateTimeISO().toString(),
              isUser: false,
            },
          ]);
          setDisableAll({
            endChat: true,
            newConversation: false,
            sendMessage: false,
            inputMessage: false,
            oldConvoButtons: false,
          });
          setIsPostQOpen(false);
        })
        .catch((err) => {
          // console.log(err);
        });
    }
  };
  
  const [open, setOpen] = useState(true);
  useEffect(() => {
    if (isPostQOpen) {
      setStudentResponse([]); // Clear student response
      fetchSurveyQuestions();
    }
  }, [isPostQOpen]);

  return (
    <>

      <Modal open={isPostQOpen}>
      <Box sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '75%',
          bgcolor: 'background.paper',
          boxShadow: 10,
          pt: 2,
          px: 4,
          pb: 3,
          borderRadius: '8px',
          minWidth: '450px',
        }}>
        <Box>
          <Box className="d-flex align-items-center">
            <div className="d-flex flex-col">
              <Text as="h1" style={{ fontFamily: "Poppins", fontWeight: 500, fontSize: "28px", }}>
                Post-Session Questions
              </Text>
            </div>
          </Box>

          {isLoading ? (
            <Box style={{ height: "80vh" }}>
            <VStack
              className="d-flex justify-content-center align-items-center"
              style={{ fontSize: "14px", height: "80vh" }}
            >
              <Flex>
                <Spinner size={"md"} />
                <Text ms={5}>Loading...</Text>
              </Flex>
            </VStack>
            </Box>
          ) : ( questions && questions.length > 0 &&
            <div>
              <VStack className="d-flex align-items-center" style={{ height: "80vh", backgroundColor: "white" }}>
                <div 
                  className="d-flex justify-content-center align-items-center"
                  style={{ fontSize: "16px", height: "15vh" }}
                >
                  {questions[currQuestion].question}
                </div>
                <div
                  className="d-flex justify-content-center align-items-center flex-row w-100"
                  style={{ minHeight: "65vh" }}
                >
                  {/* Question Type: MULTIPLE CHOICE  */}
                  {questions[currQuestion] && questions[currQuestion].question_type == "MULTIPLE_CHOICE" && (
                      <div>
                        <RadioGroup display="grid" gridGap={4}>
                          {questions[currQuestion].answers.map(
                            (answer, answer_idx) => {
                              return (
                                <Button key={answer_idx}
                                style={{ fontWeight: "normal", borderRadius: "5px" }}  
                                className={
                                    studentResponse[currQuestion + 1] === "" ?
                                    "normal-border"
                                    : studentResponse[currQuestion + 1] !== answer.value
                                      ? "normal-border"
                                      : "selected-border"
                                  }
                                  onClick={(e) => {
                                    setStudentResponse({
                                      ...studentResponse,
                                      [currQuestion + 1]: answer.value,
                                    });
                                  }}
                                >
                                  <Text className="m-2">{answer.text}</Text>
                                </Button>
                              );
                            }
                          )}
                        </RadioGroup>
                      </div>
                    )}

                  {/* Question Type: SCALE */}
                  {questions[currQuestion] &&
                    questions[currQuestion].question_type == "SCALE" && (
                      <RadioGroup display="grid" gridGap={4}>
                        <HStack
                          spacing={7}
                          style={{
                            display: "flex",
                            flexDirection: "row",
                            width: "100%",
                            justifyContent: "center",
                            alignItems: "center",
                          }}
                        >
                          {questions[currQuestion].answers.map(
                            (answer, answer_idx) => {
                              return (
                                <div>
                                  <span
                                    style={{
                                      position: "absolute",
                                      marginLeft: "-30px",
                                      marginTop: "-50px",
                                      fontSize: "14px",
                                      width: "100px",
                                      minHeight: "50px",
                                      textAlign: "center",
                                      display: "flex",
                                      justifyContent: "center",
                                      alignItems: "center",
                                    }}
                                  >
                                    {answer.text}
                                  </span>
                                  <Button
                                    style={{
                                      fontWeight: "normal",
                                      borderRadius: "5px",
                                      padding: "10px 15px",
                                    }}
                                    className={
                                      studentResponse[currQuestion + 1] === "" ?
                                      "normal-border"
                                      : studentResponse[currQuestion + 1] !== answer.value
                                        ? "normal-border"
                                        : "selected-border"
                                    }
                                    onClick={(e) => {
                                      setStudentResponse({
                                        ...studentResponse,
                                        [currQuestion + 1]: answer.value,
                                      });
                                    }}
                                  >
                                    <Text>{answer.value}</Text>
                                  </Button>
                                </div>
                              );
                            }
                          )}
                        </HStack>
                      </RadioGroup>
                    )}

                  {/* Question Type: OPEN_ENDED */}
                  {questions[currQuestion] && questions[currQuestion].question_type == "OPEN_ENDED" && (
                    <Textarea
                      className="form-control"
                      css={{ resize: "none" }}
                      variant={"filled"}
                      placeholder="Enter your response here..."
                        style={{
                        width: "100%",
                        height: "30vh",
                        borderRadius: "8px",
                        fontSize: "14px",
                        padding: "8px",
                        paddingLeft: "16px",
                        paddingRight: "16px",
                      }}
                      value={studentResponse[currQuestion + 1]}
                      onChange={(e) => {
                        console.log({
                          ...studentResponse,
                          [currQuestion + 1]: e.target.value,
                        })
                        setStudentResponse({
                          ...studentResponse,
                          [currQuestion + 1]: e.target.value,
                        });
                      }}
                    />
                  )}
                </div>
              </VStack>

              {/* Survey actions */}
              <Box>
                {currQuestion != questions.length - 1 ? (
                  <Flex>
                    {currQuestion != 0 && (
                      <Button
                        className="normal-border p-2"
                        style={{ borderRadius: "5px" }}
                        onClick={() => { setCurrQuestion(currQuestion - 1); }}
                      >
                        Previous
                      </Button>
                    )}
                    <Spacer />
                    <Button
                      className={studentResponse[currQuestion + 1] ?  " normal-border" : " disabled-border"}
                      style={{ borderRadius: "5px", padding: "10px 15px"}}
                      disabled={!studentResponse[currQuestion + 1]}
                      onClick={() => { setCurrQuestion(currQuestion + 1); }}
                    >
                      Next
                    </Button>
                  </Flex>
                ) : (
                  <Flex
                    style={{
                      alignItems: "center",
                    }}
                  >
                    <Button
                    className="normal-border p-2"
                    style={{ borderRadius: "5px" }}
                      onClick={() => {
                        setCurrQuestion(currQuestion - 1);
                      }}
                    >
                      Back
                    </Button>
                    <Spacer />
                    {isSubmitting && (
                      <div style={{ display: "flex", alignItems: "center" }}>
                        <Spinner color="gray" size={"xs"} style={{ marginRight: "5px" }} />
                        <Text color="gray" fontSize={"12px"}> Saving response...&nbsp; </Text>
                      </div>
                    )}
                    <Button
                      className={"p-2 " + ((studentResponse[currQuestion + 1] && !isSubmitting) ? "done-button" : "disabled-border")}
                      disabled={ !studentResponse[currQuestion + 1] || isSubmitting }
                      onClick={() => { submitResponse(); }}
                    >
                      Done
                    </Button>
                  </Flex>
                )}
              </Box>
            </div>
          )}
      </Box>
        </Box>

      </Modal>
    </>
  );
};

export default PostQuestions;
