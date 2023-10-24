import React, { useState, useEffect } from "react";
import axios from "axios";
import fileDownload from "js-file-download";
import StatCard from "../components/StatCard";
import { useDeploymentFilter } from "../../../contexts/DeploymentFilterContext";
import { useUserScope } from "../../../contexts/UserScopeContext";

const TotalChatlogCountCard = () => {
    
    const { deploymentFilter } = useDeploymentFilter();
    const { userScope } = useUserScope();
    const [isLoading, setIsLoading] = useState(false);
    const [count, setCount] = useState(0);

    /**
     * Get the total number of conversations based on the user scope and deployment filter.
     */
    const getTotalChatlogAmount = async () => {
        setIsLoading(true);
        let scopes = userScope.map((scope) => scope.id).join(",");
        let deployments = deploymentFilter.map((deployment) => deployment.deployment_id).join(",");

        await axios
        .get(
          process.env.REACT_APP_API_URL + `/researchers/v2/total-chatlog-count`,
            {
                params: {
                    user_roles: scopes,
                    deployment_ids: deployments,
                }
            }
        )
        .then((res) => { setCount(res.data.total_chatlog_count); setIsLoading(false); })
        .catch((err) => { console.log(err); setIsLoading(false); });
    }

    useEffect(() => { 
        getTotalChatlogAmount(); 
    }, [userScope, deploymentFilter]);

    return (<StatCard
        title={"Total Amount of Messages"}
        label={isLoading ? "-" : count}
        helpText={"messages sent by users"}
      />);
}

export default TotalChatlogCountCard;