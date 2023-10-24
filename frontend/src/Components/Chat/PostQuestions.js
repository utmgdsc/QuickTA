import {
  Button,
  Spacer,
  HStack,
  RadioGroup,
  Textarea,
  VStack,
  useDisclosure,
  Radio,
  Text,
} from "@chakra-ui/react";
import axios from "axios";
import { useEffect, useState } from "react";
import { Temporal } from "@js-temporal/polyfill";
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';


const PostQuestions = ({
  isPostQOpen,
  setIsPostQOpen,
  setIsOpenTechAssessment,
  setDisableAll,
  updateMessages,
  updateInConvo,
  updateConvoID,
  conversations,
  conversation_id,
  setConversations,
  UTORid,
  setStudentResponse,
  setDisableAllOption,
  setAnswer,
  setDisplayAnswer,
  setAnswerFlavorText
}) => {
  const [showModalIndex, setShowModalIndex] = useState(0);
  const [error, setError] = useState();
  const [questions, setQuestions] = useState([{}]);
  const [optionsSelected, setOptionsSelected] = useState([]);
  const [scaleSurveyId, setScaleSurveyId] = useState("");
  const [openEndedQuestions, setOpenEndedQuestions] = useState([{}]);
  const [open_ended_surveyId, setOpenEndedSurveyId] = useState("");

  const fetchQuestions = () => {
    axios
      .get(
        process.env.REACT_APP_API_URL +
          "/survey/details?survey_id=1d26169c-aad0-41e3-b74b-30d6511a56f0"
      )
      .then((res) => {
        setQuestions(res.data.questions);
        setScaleSurveyId(res.data.survey_id);
        // fetch prompt question here
        axios
          .get(
            process.env.REACT_APP_API_URL +
              "/survey/details?survey_id=428964a0-2ac5-4669-b8d8-2cc48927fb1d"
          )
          .then((res2) => {
            setQuestions([...res.data.questions, ...res2.data.questions]);
            setOpenEndedQuestions(res2.data.questions);
            setOpenEndedSurveyId(res2.data.survey_id);
          })
          .catch((err) => {
            setError("Error fetching prompt question");
            setError(err);
            // console.log(err);
          });
      })
      .catch((err) => {
        setError(err);
        // console.log(err);
      });
  };

  const checkValidResponse = () => {
    for (let i = 0; i < questions.length; i++) {
      if (
        (optionsSelected[questions[i].question_type] === "OPEN_ENDED" &&
          optionsSelected[questions[i].open_ended_answer] === "") ||
        (optionsSelected[questions[i].question_type] === "SCALE" &&
          optionsSelected[questions[i].answer] <= 0)
      ) {
        return false;
      }
    }
    return true;
  };

  const submitResponse = () => {
    let allResponses = [];
    for (var option in optionsSelected) {
      let data = {
        utorid: UTORid,
        question_type: questions[option - 1].question_type,
        conversation_id: conversation_id,
        question_id: questions[option - 1].question_id,
        survey_type: "Post",
        answer: optionsSelected[option],
      };

      if (data.question_type === "SCALE") {
        data.survey_id = scaleSurveyId;
      } else if (data.question_type === "OPEN_ENDED") {
        data.survey_id = open_ended_surveyId;
      }
      console.log(optionsSelected[option], data.answer);

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
        .post(
          process.env.REACT_APP_API_URL + "/survey/questions/answer",
          allResponses
        )
        .then((res) => {
          // Clear messages, response
          // console.log("Successfully submitted response!");
          setOptionsSelected([]);
          setStudentResponse(null);
          setDisableAllOption(false);
          setAnswer("");
          setDisplayAnswer(false);
          setAnswerFlavorText("");

          // find current conversation
          let currConvo = conversations.find(
            (convo) => convo.conversation_id === conversation_id
          );

          // update conversation
          let newConversations = [
            { ...currConvo, status: "I" },
            ...conversations.filter(
              (convo) => convo.conversation_id !== conversation_id
            ),
          ];
          setConversations(newConversations);

          updateInConvo(false);
          updateConvoID("");
          updateMessages([
            {
              message:
                "Hi! I am an AI assistant designed to support you in your Python programming learning journey. I cannot give out solutions to your assignments (python code) but I can help guide you if you get stuck. The chat is monitored, if you continue asking for the solution here, the instructors would be made aware of it. How can I help you?",
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
        })
        .catch((err) => {
          setError(err);
          // console.log(err);
        });
    }
  };

  useEffect(() => {
    fetchQuestions();
  }, [UTORid]);

  return (
    <>
      <Modal
        open={isPostQOpen}
        // onClose={() => setIsPostQOpen(false)}
      >
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
        {showModalIndex == 0 && <Box>
            <Box>
            <p style={{ fontWeight: '600', fontStyle: 'Poppins', fontSize: '20px', lineHeight: '30px' }}>Post Questions</p>
            </Box>
            <Box style={{
                  overflowY: "scroll",
                  overflowX: "scroll",
                  width: "100%",
                }}>
              <div>
                {questions.map((question, question_idx) => {
                  if (question_idx < 4)
                    return (
                    <VStack py={2} key={question_idx}>
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
                              setOptionsSelected({
                                ...optionsSelected,
                                [question_idx + 1]: value,
                              });
                              // console.log(optionsSelected);
                            }}
                            value={parseInt(optionsSelected[question_idx + 1])}
                            display="grid"
                            gridGap={4}
                          >
                              <HStack direction="row" spacing={10}>
                                {question.answers &&
                                  question.answers.map((answer, answer_idx) => {
                                    return (
                                      <div
                                        key={answer_idx}
                                        className="answer-option"
                                      >
                                        <label>
                                          <Button
                                            value={answer.value}
                                            className={`
                                            grey-button  
                                            ${optionsSelected[question_idx + 1] ==
                                              answer.value
                                                ? "selected-border"
                                                : "hidden-border"}
                                            `
                                            }
                                            onClick={(e) => {
                                              setOptionsSelected({
                                                ...optionsSelected,
                                                [question_idx + 1]:
                                                  e.target.value,
                                              });
                                            }}
                                          >
                                            {answer.value}
                                          </Button>
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
                    );
                })}
              </div>
            </Box>
            <HStack>
              <Button
                className="grey-button"
                onClick={() => {
                  setIsPostQOpen(false);
                  setIsOpenTechAssessment(true);
                }}
              >
                Back
              </Button>
              <Spacer />
              <Button
              className={`grey-button ${
                 (optionsSelected[1] === undefined ||
                  optionsSelected[2] === undefined ||
                  optionsSelected[3] === undefined ||
                  optionsSelected[4] === undefined) ?
                  "disabled-choice" : ""
              }`}
                onClick={() => {
                  if (!(optionsSelected[1] === undefined ||
                    optionsSelected[2] === undefined ||
                    optionsSelected[3] === undefined ||
                    optionsSelected[4] === undefined)) {
                      setShowModalIndex(1);
                      // console.log("Submit button clicked");
                    }
                }}
              >
                Next
              </Button>
            </HStack>
          </Box>}
          {showModalIndex == 1 &&  
          <Box>
          <Box>
            <p style={{ fontWeight: '600', fontStyle: 'Poppins', fontSize: '20px', lineHeight: '30px' }}>Open-Ended Response</p>
          </Box>
            <Box>
              <div style={{ paddingBottom: "40px" }}>
                <Text style={{ fontFamily: "Poppins" }}>
                  {openEndedQuestions[0].question}
                </Text>
              </div>
              <Textarea
                name={"prompt"}
                style={{
                  width: "100%",
                  height: "200px",
                  borderRadius: "8px",
                  padding: "8px",
                  paddingLeft: "16px",
                  paddingRight: "16px",
                  color: "#4A5568",
                  background: "#EDF2F6",
                }}
                placeholder={"Enter your response here"}
                onChange={(e) => {
                  setOptionsSelected({
                    ...optionsSelected,
                    5: e.target.value,
                  });
                }}
              >
                {optionsSelected[5]}
              </Textarea>
            </Box>
            <HStack>
              <Button
                className="grey-button"
                onClick={() => { setShowModalIndex(0); }}>
                Back
              </Button>
              <Spacer />
              <Button
                className={`grey-button ${
                  optionsSelected[5] === "" ? "disabled-choice" : ""
                }`}
                color={"white"}
                background={optionsSelected[5] === "" ? "gray.500" : "blue.500"}
                onClick={() => {
                  if (optionsSelected[5] === "") {
                    // console.log("Please enter a response");
                  } else {
                    setShowModalIndex(0);
                    setIsPostQOpen(false);
                    submitResponse();
                  }
                }}
              >
                Submit
              </Button>

            </HStack>
          </Box>}
        </Box>

      </Modal>
    </>
  );
};

export default PostQuestions;
