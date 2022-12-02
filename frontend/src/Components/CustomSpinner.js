import React from 'react'
import {Spinner} from "@chakra-ui/react";

export default function CustomSpinner({ style, spinnerChakraSize }) {
    const defaultStyles = {
        height: '100vh',
        backgroundColor: 'white',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      };
      return (
        <div style={{ ...style, ...defaultStyles }}>
          <Spinner size={spinnerChakraSize} />
        </div>
      );
}

CustomSpinner.defaultProps = { style: {}, spinnerChakraSize: 'xl' };
