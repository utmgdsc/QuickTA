import React, { useState, useEffect } from "react";
import axios from "axios";
import fileDownload from "js-file-download";
import StatCard from "../components/StatCard";
import { useDeploymentFilter } from "../../../Contexts/DeploymentFilterContext";
import { useUserScope } from "../../../Contexts/UserScopeContext";

const MinMaxChatlogCountCard = () => {
    
    const { deploymentFilter } = useDeploymentFilter();
    const { userScope } = useUserScope();
    const [isLoading, setIsLoading] = useState(false);
    const [minCount, setMinCount] = useState(0);
    const [maxCount, setMaxCount] = useState(0);

    /**
     * Get the total number of conversations based on the user scope and deployment filter.
     */
    const getMinMaxChatlogAmount = async () => {
        setIsLoading(true);
        let scopes = userScope.map((scope) => scope.id).join(",");
        let deployments = deploymentFilter.map((deployment) => deployment.deployment_id).join(",");

        await axios
        .get(
          process.env.REACT_APP_API_URL + `/researchers/v2/min-max-chatlog-count`,
            {
                params: {
                    user_roles: scopes,
                    deployment_ids: deployments,
                }
            }
        )
        .then((res) => { 
            setMinCount(res.data.min_chatlog_count); 
            setMaxCount(res.data.max_chatlog_count);
            setIsLoading(false); 
        })
        .catch((err) => { console.log(err); setIsLoading(false); });
    }

    useEffect(() => { 
        getMinMaxChatlogAmount(); 
    }, [userScope, deploymentFilter]);

    return (<StatCard
        title={"Range of Messages Sent per Conversation"}
        label={isLoading ? "-" : `${minCount} & ${maxCount}`}
        helpText={"min and max messages sent by users in a conversation"}
      />);
}

export default MinMaxChatlogCountCard;