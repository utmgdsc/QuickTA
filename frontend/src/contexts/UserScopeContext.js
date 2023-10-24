import React, { createContext, useContext, useState } from 'react';

const UserScopeContext = createContext();

export const UserScopeProvider = ({ children }) => {
    const [userScope, setUserScope] = useState([]);
        return (
            <UserScopeContext.Provider value={{ userScope, setUserScope }}>
            {children}
            </UserScopeContext.Provider>
        );
    }

export const useUserScope = () => useContext(UserScopeContext);
