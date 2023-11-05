import React from 'react';
import { Text } from '@chakra-ui/react';
import Chat from '../../Chat/Chat';
import SimpleChat from './SimpleChat';
import { useState } from 'react';
import { Alert } from '@mui/material';

const LLMBasedReflection = ({ UTORid, userId, stepId, setStepId}) => {
    const DEFAULT_MODEL_ID = "61290a38-93e5-479a-84d5-a7bc62e5dfd5"
    

    return (
        <div className="container">
            {/* Title */}
            <div className="d-flex align-items-center">
                <div className="d-flex flex-col">
                    <Text as="h1" style={{ fontFamily: "Poppins", fontWeight: 500, fontSize: "28px", }}>
                        Chat-based Reflection
                    </Text>
                </div>
            </div>
            {/* Description */}
            <Alert severity="info" className="mt-3 mb-3">
                After you have completed your reflection, please click on <b>"Assess Understanding & End Conversation"</b> to continue on!
            </Alert>
            {/* Chatbox */}
            <SimpleChat
                UTORid={UTORid}
                userId={userId}
                defaultModelId={DEFAULT_MODEL_ID}
                stepId={stepId}
                setStepId={setStepId}
            />

        </div>  
    )
}
export default LLMBasedReflection;