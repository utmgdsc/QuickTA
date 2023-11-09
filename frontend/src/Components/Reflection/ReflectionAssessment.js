import {
    Button,
    RadioGroup,
    useDisclosure,
    Spinner,
    Text,
  } from "@chakra-ui/react";
  import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
  import React, { useEffect, useState } from "react";
  import axios from "axios";
  import Modal from '@mui/material/Modal';
  import Box from '@mui/material/Box';
import LoadingScreen from "../LoadingScreen";
  
  const ReflectionAssessment = ({ UTORid, assessmentQuestionId, setStepId, stepId }) => {
    const {
      isOpen: isErrOpen,
      onOpen: onErrOpen,
      onClose: onErrClose,
    } = useDisclosure();
    const [error, setError] = useState();
    const [code, setCode] = useState({ question: "", language: "" });
    const [options, setOptions] = useState([]);
    const [studentResponse, setStudentResponse] = useState(null);
    const [answer, setAnswer] = useState("");
    const [displayAnswer, setDisplayAnswer] = useState(false);
    const [answerFlavorText, setAnswerFlavorText] = useState("");
    const [assessement_question_id, setAssessmentQuestionID] = useState("");
    const [disableAllOption, setDisableAllOption] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
  
    // Fetch code, questions, and answer for tech assessment
    const fetchCodeQuestion = () => {
      axios
        .get(
          process.env.REACT_APP_API_URL + "/assessment/question",
            { params: {assessment_question_id: assessmentQuestionId}}
        )
        .then((res) => {
          let data = res.data;
          // let { question, parsedCode } = { "" , ""} parseCode(data.question);
          setCode({
            question: data.question,
            code: "",
            language: data.language ? data.language : "",
          });
          setOptions(data.choices);
          setAssessmentQuestionID(data.assessment_question_id);
          // console.log(data.choices);
        })
        .catch((err) => {
          setError(err);
          // console.log(err);
          onErrOpen();
        });
    };
  
    useEffect(() => {
      fetchCodeQuestion();
    }, []);
  
    const parseCode = (text) => {
      let start = text.indexOf("```python");
      let end = text.indexOf("```", start + 1);
      let parsedCode = text.substring(start + 9, end);
  
      let question = text.substring(0, start);
  
      return { question, parsedCode };
    };
  
    return (
      <Box ml={"12vw"} mr={"12vw"} mt={10}>
        <Box>
            <p style={{ fontWeight: '600', fontStyle: 'Poppins', fontSize: '20px', lineHeight: '30px' }}>Technical Assessment</p>
        </Box>
        <Box>
          {code.question
            ? <Box mt={4} mb={4}>
                {/* Code Blob */}
                <Box width={"100%"} >
                <Text>{code.question}</Text>
                {code.code && 
                  <SyntaxHighlighter
                      showLineNumbers={true}
                      wrapLongLines={true}
                      language={"python"}
                      codeTagProps={{ style: { fontSize: "12px" } }}
                  >
                      {code.code}
                  </SyntaxHighlighter>
                }
                </Box>
                {/* MC choices */}
                <RadioGroup display="grid" gridGap={4} mt={10}
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                }}
                >
                {options.map((element) => (
                    <Box
                    key={element.choice + element.flavor_text}
                    className={`
                        ${studentResponse != element.choice
                        ? "hidden-border"
                        : !answer
                        ? "selected-border"
                        : answer == studentResponse
                        ? "correct-border"
                        : "wrong-border"
                        // + 
                        }
                        ${disableAllOption ? 
                        "disabled-choice" : ""}
                    `
                    }

                    onClick={(e) => { if (!disableAllOption) setStudentResponse(element.choice); }}
                    style={{
                        justifyContent: "left",
                        padding: "5px 20px",
                        borderRadius: "8px",
                        marginTop: "5px",
                        fontWeight: "500",
                        width: "85%",
                        cursor: disableAllOption ? "not-allowed": "pointer",
                    }}
                    >
                    <Text margins={2} style={{
                        fontWeight: "500",
                        textAlign: "left",
                        warp: "break-word",
                        fontSize: "14px",
                    }}>{element.flavor_text}</Text>
                    </Box>
                ))}
                </RadioGroup>
              </Box>
            : <LoadingScreen />
          }
        </Box>

        {/* Next Button */}
        <Box
            style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "flex-end",
            alignItems: "center",
            }}
        >
            {displayAnswer ? (
            <Text mx={10} color={"green"}>
                {answerFlavorText}
            </Text>
            ) : null}
            {isSubmitting && (
            <div style={{ display: "flex", alignItems: "center" }}>
                <Spinner
                color="gray"
                size={"xs"}
                style={{ marginRight: "5px" }}
                />
                <Text color="gray" fontSize={"12px"}>
                Saving response...&nbsp;
                </Text>
            </div>
            )}
            <Button
            className={`grey-button ${
                (studentResponse === null || isSubmitting)
                ? "disabled-choice"
                : ""
            }`}
            style={{ margin: 0 }}
            isDisabled={studentResponse === null || isSubmitting}
            onClick={() => {
                if (studentResponse === null || isSubmitting) return;
                if (!disableAllOption) {
                setIsSubmitting(true);
                //Display Flavor Text
                setDisableAllOption(true);

                axios
                    .post(
                    process.env.REACT_APP_API_URL + "/assessment/v2/question/answer",
                      {
                          utorid: UTORid,
                          assessment_id: "756fd149-b8d7-45dc-b417-f5fd40385cfd",
                          assessment_question_id: assessement_question_id,
                          answer: studentResponse,
                      }
                    ).then((res) => {
                      let data = res.data;
                      setAnswer(data.correct_answer);
                      setAnswerFlavorText(data.correct_answer_flavor_text);
                      setIsSubmitting(false);
                      setStepId(stepId + 1);
                    })
                    .catch((err) => {
                    setError(err);
                    // console.log(err);
                    onErrOpen();
                    });
                setDisplayAnswer(true);
                } else {

                }
            }}
            >
            Next
            </Button>
        </Box>
      </Box>
    );
  };
  
  export default ReflectionAssessment;
  