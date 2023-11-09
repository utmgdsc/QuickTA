import { Spinner, VStack } from "@chakra-ui/react";
import axios from "axios";
import { useEffect, useState } from "react";
import { RadioGroup } from "@chakra-ui/radio";
import { HStack } from "@chakra-ui/layout";
import { useDisclosure } from "@chakra-ui/hooks";
import { Button } from "@chakra-ui/button";
import ErrorDrawer from "../ErrorDrawer";
import { Text } from "@chakra-ui/react";
import { Box } from "@chakra-ui/layout";
import { Flex } from "@chakra-ui/layout";
import { Spacer } from "@chakra-ui/layout";

const PreSurvey = ({ UTORid, isNewUser, setIsNewUser, modelId }) => {
  const [questions, setQuestions] = useState([{}]); // [ {question: "", options: []}, ... ]
  const [currQuestion, setCurrQuestion] = useState(0);
  const [surveyID, setSurveyID] = useState("");
  const [studentResponse, setStudentResponse] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const {
    isOpen: isErrOpen,
    onOpen: onErrOpen,
    onClose: onErrClose,
  } = useDisclosure();
  const [error, setError] = useState();

  let PRE_SURVEY_ID = "81abc01e-5d2e-475b-9752-6d9cf5a96105" // lab 8
  let POST_SURVEY_ID = "9338790a-3c47-43ac-82ad-09c6cbe9a035" // lab 8

  /** Fetch pre-survey questions from backend. */
  const fetchPreSurvey = () => {
    axios
      .get( process.env.REACT_APP_API_URL + "/survey/details",
          { params: { survey_id: PRE_SURVEY_ID } }
      )
      .then((res) => {
        // console.log(res.data);
        setQuestions(res.data.questions);
        setSurveyID(res.data.survey_id);
      })
      .catch((err) => {
        setError(err);
        onErrOpen();
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
        survey_type: "Pre",
        survey_id: surveyID,
        answer: studentResponse[response],
      };
      allResponses.push(data);
    }

    if (checkValidResponse() === false) {
      setError("Please answer all questions!");
      onErrOpen();
    } else {
      axios
        .post(
          process.env.REACT_APP_API_URL + "/survey/questions/answer",
          allResponses
        )
        .then((res) => {
          // console.log(res.data);
          setIsNewUser(false);
          setIsSubmitting(false);
        })
        .catch((err) => {
          setIsSubmitting(false);
          setError(err);
          onErrOpen();
        });
    }
  };

  useEffect(() => {
    setIsLoading(true);
    fetchPreSurvey();
    setIsLoading(false);
  }, []);

  if (!isNewUser) {
    return ( 
      <Box className="d-flex flex-col align-items-center justify-content-center" style={{ width: '100vw', height: '100vh' }}>
        <Text as="h1" style={{ fontFamily: "Poppins", fontWeight: 500, fontSize: "28px", }}>
          Not authorized
        </Text>
      </Box>);
  }

  return (
    <div>
      <Box ml={"12vw"} mr={"12vw"} mt={10}>
        <Box className="d-flex align-items-center">
          <div className="d-flex flex-col">
            <Text as="h1" style={{ fontFamily: "Poppins", fontWeight: 500, fontSize: "28px", }}>
              {/* Questionnaire */}
              Pre-Task Survey 
            </Text>
            {/* <Text color={"gray.400"}>(For First-Time User Logins Only)</Text> */}
          </div>
        </Box>
        {isLoading ? (
          <VStack
            className="d-flex justify-content-center align-items-center"
            style={{ fontSize: "14px", height: "80vh" }}
          >
            <Flex>
              <Spinner size={"md"} />
              <Text ms={5}>Loading...</Text>
            </Flex>
          </VStack>
        ) : (
          <div>
            <VStack className="d-flex align-items-center" style={{ minHeight: "80vh" }}>
              <div className="d-flex justify-content-center align-items-center"
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
                              <Button style={{ fontWeight: "normal", borderRadius: "5px" }}
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
                        spacing={10}
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
                    className={"p-2 " 
                    + ((studentResponse[currQuestion + 1] && !isSubmitting) ? "done-button" : "disabled-border")
                  }
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
      <ErrorDrawer isOpen={isErrOpen} onClose={onErrClose} error={error} />
    </div>
  );
};

export default PreSurvey;
