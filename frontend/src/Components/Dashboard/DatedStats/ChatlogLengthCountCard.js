import React, { useState, useEffect } from "react";
import axios from "axios";
import StatCard from "../components/StatCard";
import { useDeploymentFilter } from "../../../contexts/DeploymentFilterContext";
import { useUserScope } from "../../../contexts/UserScopeContext";

const ChatlogLengthCountCard = () => {
    
    const { deploymentFilter } = useDeploymentFilter();
    const { userScope } = useUserScope();
    const [isLoading, setIsLoading] = useState(false);
    const [count, setCount] = useState({
        "min": 0,
        "max": 0,
        "avg": 0,
        "total": 0,
    });

    /**
     * Get the total number of conversations based on the user scope and deployment filter.
     */
    const getChatlogLengthCount = async () => {
        setIsLoading(true);
        let scopes = userScope.map((scope) => scope.id).join(",");
        let deployments = deploymentFilter.map((deployment) => deployment.deployment_id).join(",");

        await axios
        .get(
          process.env.REACT_APP_API_URL + `/researchers/v2/chatlog-length-count`,
            {
                params: {
                    user_roles: scopes,
                    deployment_ids: deployments,
                }
            }
        )
        .then((res) => { setCount({
            "min": res.data.min,
            "max": res.data.max,
            "avg": res.data.avg,
            "total": res.data.total,
        }); setIsLoading(false); })
        .catch((err) => { console.log(err); setIsLoading(false); });
    }

    useEffect(() => { 
        getChatlogLengthCount(); 
    }, [userScope, deploymentFilter]);

    return (<StatCard
        title={"Average Message Length"}
        label={isLoading ? "-" : `${count.avg}`}
        miniLabel={isLoading ? " in the range of [-, -]" : ` in the range of [${count.min}, ${count.max}]`}
        helpText={"number of words per chatlog, with a total of " + count.total + " words in all chatlogs sent by users"}
      />);
}

export default ChatlogLengthCountCard;