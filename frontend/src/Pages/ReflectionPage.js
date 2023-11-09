import { useEffect, useState } from "react";
import axios from "axios";
import Box from '@mui/material/Box';
import Text from '@mui/material/Typography';
import ReflectionSurvey from "../Components/Reflection/ReflectionSurvey";
import ReflectionAssessment from "../Components/Reflection/ReflectionAssessment";
import ReflectionCompletion from "../Components/Reflection/ReflectionCompletion";
import { CircularProgress, LinearProgress, Tooltip } from "@mui/material";
import LoadingScreen from "../Components/LoadingScreen";
import ReflectionTask from "../Components/Reflection/ReflectionTask";


const ReflectionPage = ({ isNewUser, setIsNewUser, UTORid, userId, modelId }) => {
  
  /**
   * StepId: Denotes the current stage of the reflection survey
   * 0 = Pre-task Question
   * 1 = Pre-task MC
   * 2 = User Condition
   * 3 = Post-task MC
   * 4 = Post-task Question
   * 5 = Done
   */
  const [stepId, setStepId] = useState(0)
  const [assessmentQuestionIds, setAssessmentQuestionIds] = useState([]);

  let PRE_SURVEY_ID = "81abc01e-5d2e-475b-9752-6d9cf5a96105" // lab 8 "81abc01e-5d2e-475b-9752-6d9cf5a96105" // lab 8
  let POST_SURVEY_ID = "9338790a-3c47-43ac-82ad-09c6cbe9a035" // lab 8
  let TECHNICAL_ASSESSMENT_ID = "756fd149-b8d7-45dc-b417-f5fd40385cfd"

  // Include logic to determine the current step of the reflection survey from localStorage

  const getAssessmentQuestionIds = async () => {
      axios.get( process.env.REACT_APP_API_URL + "/assessment/question/random",
            { params: {assessment_id: TECHNICAL_ASSESSMENT_ID, questions: 2}}
        ).then((res) => {
          let data = res.data;
          let questionIds = data.map((question) => question.assessment_question_id);
          localStorage.setItem("qta_assessmentQuestionIds", JSON.stringify(questionIds));
          setAssessmentQuestionIds(questionIds);
        }).catch((err) => {
          console.log(err);
        })
   }


  
  useEffect(() => {
    let assessmentQuestions = localStorage.getItem("qta_assessmentQuestionIds");
    if (!assessmentQuestions) { getAssessmentQuestionIds(); }
    else { setAssessmentQuestionIds(JSON.parse(localStorage.getItem("qta_assessmentQuestionIds"))); }
  }, []);

  // Get the current step of the reflection survey from localStorage
  useEffect(() => {
    let stepId = parseInt(localStorage.getItem("qta_stepId"));
    if (stepId) { setStepId(stepId); }
   
  }, []);

  // Update the current step of the reflection survey in localStorage
  useEffect(() => {
    localStorage.setItem("qta_stepId", stepId);
  }, [stepId]);

  // If user is not new, set the stepId to 5 

  useEffect(() => { 
    if (isNewUser == false && UTORid) { localStorage.setItem("qta_stepId", 5); setStepId(5); }
  }, [isNewUser, UTORid]);
  
  return (
    <div style={{ height: '100vh' }}>
      <div ml={"12vw"} mr={"12vw"} mt={10} style={{ height: "100%" }}>
        <div className="py-3 px-3">
          <Tooltip title={`Progress: ${stepId < 6 ? stepId + 1 : 5} / 5`}>
            <LinearProgress variant="determinate" value={(stepId) * 20} />
          </Tooltip>
        </div>
        {stepId === 0 && 
          <ReflectionSurvey     
            stepId={stepId}
            setStepId={setStepId}
            UTORid={UTORid}
            setIsNewUser={setIsNewUser}
            surveyId={PRE_SURVEY_ID}
            type={"PRE"}
        />
        }
        {stepId === 1 ? assessmentQuestionIds.length > 0 
            ? <ReflectionAssessment
              UTORid={UTORid}
              stepId={stepId}
              setStepId={setStepId}
              assessmentQuestionId={assessmentQuestionIds[0]}
            /> 
            : <LoadingScreen />
          : <></>
        }
        {stepId === 2 && 
          <ReflectionTask 
            UTORid={UTORid}
            userId={userId}
            modelId={modelId}
            stepId={stepId}
            setStepId={setStepId}
          />
        }
        {stepId === 3 ? assessmentQuestionIds.length > 0 
            ? <ReflectionAssessment 
              UTORid={UTORid}
              stepId={stepId}
              setStepId={setStepId}
              assessmentQuestionId={assessmentQuestionIds[1]}
            />
            : <LoadingScreen />
          : <></>
        }
        {stepId === 4 && 
          <ReflectionSurvey  
            stepId={stepId}        
            setStepId={setStepId}
            UTORid={UTORid}
            surveyId={POST_SURVEY_ID}
            type={"POST"}
        />}
        {stepId === 5 &&
          <ReflectionCompletion
            isNewUser={isNewUser}
            setIsNewUser={setIsNewUser}
            UTORid={UTORid}
          />
          }

      </div>
    </div>
  )
}

export default ReflectionPage;