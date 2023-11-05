import { Box } from "@mui/material"
import React, { useState } from "react"
import SimpleChatBox from "./SimpleChatBox.js"
import SimpleChatBoxFooter from "./SimpleChatBoxFooter"
import SimpleChatBoxTopNav from "./SimpleChatBoxTopNav"
import { Temporal } from "@js-temporal/polyfill";

const SimpleChat = ({ UTORid, userId, defaultModelId, stepId, setStepId }) => {

    const DEFAULT_MESSAGES = [
      {
          message: "Hello and congratulations on completing Lab 8 on file I/O and nested lists in Python! Reflecting on your experiences is a crucial step in the learning process. To get started, could you share an earlier moment (such as during the lecture) where you have encountered concepts similar to file I/O and nested lists? How does that previous experience compare with the techniques and understanding you have applied in this assignment?",
          dateSent: Temporal.Now.zonedDateTimeISO().toString(),
          isUser: false,
      },
    ]
    const [messages, setMessages] = useState(DEFAULT_MESSAGES);
    const [waitingForResponse, setWaitingForResponse] = useState(false);
    const [currentConversationId, setCurrentConversationId] = useState("");
    const [disableAll, setDisableAll] = useState({
        inputMessage: false,
        endConversation: false,
        sendButton: false,
    });

    const chatStyle = {
      height: "85vh",
      border: "1px solid #E5E5E5",
      borderRadius: "10px",
    }

    return (
        <div style={chatStyle}>
            {/* Chatbox top navigation - max height: 15% */}
              <SimpleChatBoxTopNav
                  // openConvoHistory={openConvoHistory}
                  // setOpenConvoHistory={setOpenConvoHistory}
                  // courseCode={currCourse.course_code}
                  // currConvoID={currConvoID}
                  currentConversationId={currentConversationId}
              />

            {/* Chatbox main chat box - max Height: 70% */}
              <SimpleChatBox 
                  messages={messages} 
                  waitingForResponse={waitingForResponse}
              />

            {/* Chatbox footer controllers - max Height: 15% */}
            <SimpleChatBoxFooter
                userId={userId}
                currentConversationId={currentConversationId}
                setCurrentConversationId={setCurrentConversationId}
                disableAll={disableAll}
                setDisableAll={setDisableAll}
                messages={messages}
                setMessages={setMessages}
                waitingForResponse={waitingForResponse}
                setWaitingForResponse={setWaitingForResponse}
                defaultModelId={defaultModelId}
                stepId={stepId}
                setStepId={setStepId}
            />
        </div>
    )
};

export default SimpleChat;