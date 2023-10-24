import React, { useState, useEffect } from "react";
import axios from "axios";
import fileDownload from "js-file-download";
import StatCard from "../components/StatCard";
import { useDeploymentFilter } from "../../../Contexts/DeploymentFilterContext";
import { useUserScope } from "../../../Contexts/UserScopeContext";

const AvgChatlogCountCard = () => {
    
    const { deploymentFilter } = useDeploymentFilter();
    const { userScope } = useUserScope();
    const [isLoading, setIsLoading] = useState(false);
    const [count, setCount] = useState(0);

    /**
     * Get the total number of conversations based on the user scope and deployment filter.
     */
    const getAvgChatlogAmount = async () => {
        setIsLoading(true);
        let scopes = userScope.map((scope) => scope.id).join(",");
        let deployments = deploymentFilter.map((deployment) => deployment.deployment_id).join(",");

        await axios
        .get(
          process.env.REACT_APP_API_URL + `/researchers/v2/avg-chatlog-count`,
            {
                params: {
                    user_roles: scopes,
                    deployment_ids: deployments,
                }
            }
        )
        .then((res) => { setCount(res.data.avg_chatlog_count); setIsLoading(false); })
        .catch((err) => { console.log(err); setIsLoading(false); });
    }

    useEffect(() => { 
        getAvgChatlogAmount(); 
    }, [userScope, deploymentFilter]);

    return (<StatCard
        title={"Average Amount of Messages"}
        label={isLoading ? "-" : count}
        helpText={"messages sent by users on average"}
      />);
}

export default AvgChatlogCountCard;