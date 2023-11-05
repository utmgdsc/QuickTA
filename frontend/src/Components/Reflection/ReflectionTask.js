import ReflectionSurvey from "./ReflectionSurvey";
import LLMBasedReflection from "./Components/LLMBasedReflection";
import StaticContentReflection from "./Components/StaticContentReflection";

const ReflectionTask = ({ UTORid, userId, stepId, setStepId, modelId  }) => {

    return (<>
        {/* Condition 1 - Text-based Reflection (Open-ended Q) */}
        {modelId === "62d28ee3-45cf-4687-b83e-b49a9504c65b" && 
            <ReflectionSurvey
                UTORid={UTORid}
                surveyId="c3390610-c264-4537-84c5-020d347e4dcf"
                stepId={stepId}
                setStepId={setStepId}
                type="REFLECTION"
            />
        }
        {/* Condition 2 - LLM-based Reflection  */}
        {modelId === "61290a38-93e5-479a-84d5-a7bc62e5dfd5" && 
            <LLMBasedReflection 
                UTORid={UTORid}
                userId={userId}
                stepId={stepId}
                setStepId={setStepId} 
            />
        }
        {/* Condition 3 */}
        {modelId === "2089d332-ef43-4b17-bf4e-141a87eef92e" && 
            <StaticContentReflection 
                userId={userId}    
                stepId={stepId}
                setStepId={setStepId}
            />
        }
    </>)
}

export default ReflectionTask;