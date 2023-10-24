import React, { useState, useEffect } from "react";
import axios from "axios";
import fileDownload from "js-file-download";
import StatCard from "../components/StatCard";
import { useDeploymentFilter } from "../../../contexts/DeploymentFilterContext";
import { useUserScope } from "../../../contexts/UserScopeContext";

const CorrectAssessmentCountCard = () => {
    
    const { deploymentFilter } = useDeploymentFilter();
    const { userScope } = useUserScope();
    const [isLoading, setIsLoading] = useState(false);
    const [count, setCount] = useState({
        "total": 0,
        "correct": 0,
        "percentage": "0%"
    });

    /**
     * Get the total number of conversations based on the user scope and deployment filter.
     */
    const getCorrectAssessmentCount = async () => {
        setIsLoading(true);
        let scopes = userScope.map((scope) => scope.id).join(",");
        let deployments = deploymentFilter.map((deployment) => deployment.deployment_id).join(",");

        await axios
        .get(
          process.env.REACT_APP_API_URL + `/researchers/v2/correct-assessment-count`,
            {
                params: {
                    user_roles: scopes,
                    deployment_ids: deployments,
                }
            }
        )
        .then((res) => { setCount({
            "total": res.data.total,
            "correct": res.data.count,
            "percentage": res.data.percentage + "%"
        }); setIsLoading(false); })
        .catch((err) => { console.log(err); setIsLoading(false); });
    }

    useEffect(() => { 
        getCorrectAssessmentCount(); 
    }, [userScope, deploymentFilter]);

    return (<StatCard
        title={"Correct Assessment Answer Count"}
        label={isLoading ? "-" : `${count.correct}`}
        miniLabel={isLoading ? "/- (-%)" : `/${count.total} (${count.percentage})`}
        helpText={"number of correct answers for post-session technical assessments"}
      />);
}

export default CorrectAssessmentCountCard;