import React, { createContext, useState } from 'react';

export const SnackbarContext = createContext();

export const SnackbarProvider = ({ children }) => {
    const [open, setOpen] = useState(false);
    const [message, setMessage] = useState('');
    const [severity, setSeverity] = useState('info');

    const showSnackbar = (message, severity) => {
        setMessage(message);
        setSeverity(severity);
        setOpen(true);
    };

    const hideSnackbar = () => {
        setOpen(false);
    };

    const value = {
        open,
        message,
        severity,
        showSnackbar,
        hideSnackbar,
    };

    return (
        <SnackbarContext.Provider value={value}>
            {children}
        </SnackbarContext.Provider>
    );
};