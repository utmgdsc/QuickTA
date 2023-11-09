import React, { useContext } from 'react';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import { SnackbarContext } from './SnackbarContext';

/**
 * Alert component that displays a message with a severity level.
 * @param {object} props - The props object.
 * @return {JSX.Element} The JSX element that represents the Alert component.
 */
function Alert(props) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
}

/**
 * Snackbar component that displays a message with a severity level.
 * @return {JSX.Element} The JSX element that represents the Snackbar component.
 */
const SnackbarComponent = () => {
    // Get the snackbar context values using destructuring.
    const { snackbarOpen, snackbarMessage, snackbarSeverity, hideSnackbar } = useContext(SnackbarContext);

    /**
     * Handles the closing of the Snackbar.
     * @param {object} event - The event object.
     * @param {string} reason - The reason for closing the Snackbar.
     */
    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        hideSnackbar();
    };

    return (
        <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={handleClose}>
            <Alert onClose={handleClose} severity={snackbarSeverity}>
                {snackbarMessage}
            </Alert>
        </Snackbar>
    );
};

export default SnackbarComponent;