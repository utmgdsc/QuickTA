import {
  Button,
  Spacer,
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
import { useEffect, useState } from "react";
import ErrorDrawer from "../ErrorDrawer";
import { Temporal } from "@js-temporal/polyfill";

const PostQuestions = ({
  isOpen,
  onOpen,
  onClose,
  onOpenTechAssessment,
  UTORid,
  conversation_id,
  setDisableAll,
  updateMessages,
  updateInConvo,
  updateConvoID,
  conversations,
  setConversations,
  setStudentResponse,
  setDisableAllOption,
  setAnswer,
  setDisplayAnswer,
  setAnswerFlavorText,
}) => {
  const {
    isOpen: isPromptOpen,
    onOpen: onPromptOpen,
    onClose: onPromptClose,
  } = useDisclosure();
  const {
    isOpen: isErrOpen,
    onOpen: onErrOpen,
    onClose: onErrClose,
  } = useDisclosure();
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
            onErrOpen();
            setError(err);
            console.log(err);
            onErrOpen();
          });
      })
      .catch((err) => {
        setError(err);
        console.log(err);
        onErrOpen();
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
      };

      if (data.question_type === "SCALE") {
        data.answer = optionsSelected.answer;
        data.survey_id = scaleSurveyId;
      } else if (data.question_type === "OPEN_ENDED") {
        data.open_ended_answer = optionsSelected.prompt;
        data.survey_id = open_ended_surveyId;
      }

      allResponses.push(data);
    }

    if (checkValidResponse() === false) {
      console.log("invalid response");
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
          console.log("Successfully submitted response!");
          setOptionsSelected([]);
          setStudentResponse(null);
          setDisableAllOption(false);
          setAnswer("");
          setDisplayAnswer(false);
          setAnswerFlavorText("");

          // find current conversation
          console.log(conversation_id);

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
                "Hi! I am an AI assistant designed to support you in your Python programming learning journey. I cannot give out solutions to your assignments (python code) but I can help guide you if you get stuck. How can I help you?",
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
          console.log(err);
          onErrOpen();
        });
    }
  };

  useEffect(() => {
    fetchQuestions();
  }, [UTORid]);

  return (
    <>
      <Modal
        closeOnOverlayClick={false}
        isOpen={isOpen}
        onClose={onClose}
        scrollBehavior="inside"
        size={"3xl"}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            <span
              style={{
                fontFamily: "Poppins",
              }}
            >
              Post Questions
            </span>
          </ModalHeader>
          <ModalBody>
            <VStack>
              {questions.map((question, question_idx) => {
                if (question_idx < 4)
                  return (
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
                              setOptionsSelected({
                                ...optionsSelected,
                                [question_idx + 1]: value,
                              });
                              console.log(optionsSelected);
                            }}
                            value={parseInt(optionsSelected[question_idx + 1])}
                            display="grid"
                            gridGap={4}
                          >
                            <HStack direction="row" spacing={20}>
                              {question.answers &&
                                question.answers.map((answer, answer_idx) => {
                                  return (
                                    <div
                                      key={answer_idx}
                                      className="answer-option"
                                    >
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
                  );
              })}
            </VStack>
          </ModalBody>
          <ModalFooter>
            <Button
              onClick={() => {
                onClose();
                onOpenTechAssessment();
              }}
            >
              Back
            </Button>
            <Spacer />
            <Button
              disabled={
                optionsSelected[1] === undefined ||
                optionsSelected[2] === undefined ||
                optionsSelected[3] === undefined ||
                optionsSelected[4] === undefined
              }
              onClick={() => {
                console.log("Submit button clicked");
                onClose();
                onPromptOpen();
              }}
            >
              Next
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* <Modal isOpen={isPromptOpen} onClose={onPromptClose}> */}
      <Modal
        closeOnOverlayClick={false}
        isOpen={isPromptOpen}
        onClose={onPromptClose}
        size={"3xl"}
        scrollBehavior="inside"
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            <span style={{ fontFamily: "Poppins" }}>Open Ended Response</span>
          </ModalHeader>
          <ModalBody>
            <div style={{ paddingBottom: "40px" }}>
              <Text style={{ fontFamily: "Poppins" }}>
                {openEndedQuestions[0].question}
              </Text>
            </div>
            <Textarea
              name={"prompt"}
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
          </ModalBody>
          <ModalFooter>
            <Button
              onClick={() => {
                onPromptClose();
                onOpen();
              }}
            >
              Back
            </Button>
            <Spacer />
            <Button
              disabled={optionsSelected[5] === ""}
              color={"white"}
              background={optionsSelected[5] === "" ? "gray.500" : "blue.500"}
              onClick={() => {
                if (optionsSelected[5] === "") {
                  console.log("Please enter a response");
                } else {
                  onPromptClose();
                  submitResponse();
                }
              }}
            >
              Submit
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      <ErrorDrawer isOpen={isErrOpen} onClose={onErrClose} error={error} />
    </>
  );
};

export default PostQuestions;
