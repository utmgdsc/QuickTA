import React, { useState, useEffect } from "react";
import axios from "axios";
import fileDownload from "js-file-download";
import StatCard from "../components/StatCard";
import { useDeploymentFilter } from "../../../Contexts/DeploymentFilterContext";
import { useUserScope } from "../../../Contexts/UserScopeContext";

const DistinctPostSurveyResponseCountCard = () => {
    
    const { deploymentFilter } = useDeploymentFilter();
    const { userScope } = useUserScope();
    const [isLoading, setIsLoading] = useState(false);
    const [count, setCount] = useState(0);

    /**
     * Get the total number of conversations based on the user scope and deployment filter.
     */
    const getDistinctPostSurveyResponseCount = async () => {
        setIsLoading(true);
        let scopes = userScope.map((scope) => scope.id).join(",");
        let deployments = deploymentFilter.map((deployment) => deployment.deployment_id).join(",");

        await axios
        .get(
          process.env.REACT_APP_API_URL + `/researchers/v2/distinct-post-survey-count`,
            {
                params: {
                    user_roles: scopes,
                    deployment_ids: deployments,
                }
            }
        )
        .then((res) => { setCount(res.data.total); setIsLoading(false); })
        .catch((err) => { console.log(err); setIsLoading(false); });
    }

    useEffect(() => { 
        getDistinctPostSurveyResponseCount(); 
    }, [userScope, deploymentFilter]);

    return (<StatCard
        title={"Distinct Amount of Post Survey Responses"}
        label={isLoading ? "-" : count}
        helpText={"distinct users who have submitted post survey responses"}
      />);
}

export default DistinctPostSurveyResponseCountCard;