import React, { createContext, useContext, useState } from 'react';

const DeploymentFilterContext = createContext();

export const DeploymentFilterProvider = ({ children }) => {
    const [deploymentFilter, setDeploymentFilter] = useState([]);
        return (
            <DeploymentFilterContext.Provider value={{ deploymentFilter, setDeploymentFilter }}>
                {children}
            </DeploymentFilterContext.Provider>
        );
    }

export const useDeploymentFilter = () => useContext(DeploymentFilterContext);
