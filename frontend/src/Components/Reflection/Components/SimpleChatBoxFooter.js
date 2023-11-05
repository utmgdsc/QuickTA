import { Button, HStack, Textarea } from "@chakra-ui/react";
import { useState } from "react";
import axios from "axios";
import { Temporal } from "@js-temporal/polyfill";

const SimpleChatBoxFooter = ({
  userId,
  currentConversationId, setCurrentConversationId, // new name
  disableAll, setDisableAll,
  messages, setMessages,
  waitingForResponse, setWaitingForResponse,
  defaultModelId,
  stepId, setStepId,
}) => {

  // Constants
  const COURSE_ID = "7f4402cb-23c8-4305-9523-adc747c8fae7"

  // States
  const [messageText, setMessageText] = useState("");


  // Style
  const footerContainerStyle = {
    height: "15%",
    backgroundColor: "white",
    borderTop: "2px solid #EAEAEA",
    borderBottomLeftRadius: "8px",
    paddingTop: "6px",
    paddingBottom: "4px",
    paddingLeft: "3vw",
    paddingRight: "3vw",
  }

  const endConversationButtonStyle = {
    fontWeight: "600",
    fontSize: "14px",
    height: "80%",
    width: "150px",
    padding: "0 10px",
    borderRadius: "8px",
  }

  const endConversationButtonTextStyle = {
    wordWrap: "normal",
    whiteSpace: "normal",
    lineHeight: "1.2",
}

  const inputTextareaStyle = {
    width: "80%",
    height: "80%",
    borderRadius: "8px",
    fontSize: "14px",
    padding: "8px",
    paddingLeft: "16px",
    paddingRight: "16px",
    color: waitingForResponse || disableAll.inputMessage ? "#C6CCD5" : "#4A5568",
    background: waitingForResponse || disableAll.inputMessage ? "#F4F6F9" : "#EDF2F6",
    cursor: waitingForResponse || disableAll.inputMessage ? "not-allowed" : "auto",
  }

  const sendButtonStyle = {
    color: "white",
    fontWeight: "600",
    padding: "8px 12px",
    borderRadius: "8px",
  }

  /**
   * Handles the entering of a user text message. Enter and shift enter are handled differently.
   * @param {Event} e - event object consisting with the key pressed.
   */
  const handleChatKeyDown = (e) => {
    if ((e.key === "Enter" || e.keyCode === 13) && !e.shiftKey) {
      if (messageText) { handleSubmit(); }
    }
  };

  const handleEndConversationButton = () => {
    if (currentConversationId && messages.length > 1) {
      // Advance to next step
      setStepId(stepId + 1);
      axios.post(process.env.REACT_APP_API_URL + "/user/stat", {
          user_id: userId,
          operation: "llm_based_reflection_next_step",
      })
    }
  }

  const handleChangeTextarea = (e) => {
    setMessageText(e.target.value.slice(0, process.env.MAX_MESSAGE_LENGTH));
  }

  const getResponse = async (newlyGeneratedConversationId) => {
    
    // Load user message on click
    const now = Temporal.Now.zonedDateTimeISO().toString();
    axios.post(process.env.REACT_APP_API_URL + "/student/chatlog", {
        conversation_id: currentConversationId ? currentConversationId : newlyGeneratedConversationId,
        chatlog: messageText,
        time: now,
      })
      .then((response) => {
        const agentResponse = {
          message: response.data.agent.chatlog,
          dateSent: response.data.agent.time,
          isUser: "false",
        };
        setMessages((oldMessage) => [...oldMessage, agentResponse]);
        setWaitingForResponse(false);
        setMessageText("");

        setDisableAll((prevDisableAll) => ({ ...prevDisableAll, endChat: false }));
      })
      .catch((err) => {
        if (err.response.data.error.msg) {
          console.log(err.response.data.error.msg);
        }
        setDisableAll((prevDisableAll) => ({
          endChat: false,
          sendButton: false,
          inputMessage: false,
        }));
      });
  };

  const handleSubmit = async () => {

    setWaitingForResponse(true);
    
    // If in conversation, send message to current conversation. Otherwise, create a new conversation.
    if (currentConversationId && messageText) { await getResponse(); }
    else {
      // Create user text message
      const now = Temporal.Now.zonedDateTimeISO().toString();
      const userText = {
        message: messageText.slice(0, 4000),
        dateSent: now,
        isUser: "true",
      };
      setMessages((prevMessages) => [...prevMessages, userText]);
      setMessageText("");

      // Create new conversation
      axios
        .post(process.env.REACT_APP_API_URL + "/student/conversation", {
          user_id: userId,
          course_id: COURSE_ID,
          model_id: defaultModelId
        })
        .then(async (res) => {
          let data = res.data;
          setCurrentConversationId(data.conversation_id);
          setWaitingForResponse(true);

          // Get response from agent
          let conversationId = res.data.conversation_id;
          let chatlog = messageText;
          await getResponse(conversationId, chatlog, true);
        })
        .catch((err) => { setWaitingForResponse(false); });
    }
  };

  return (
    <HStack style={footerContainerStyle}> 
      {/* End Conversation Button */}
      <Button
        fontSize={"xs"}
        height={"80%"}
        className={
          `end-chat-button 
          ${(!currentConversationId && messages.length == 1) 
              || disableAll.endChat 
              || waitingForResponse 
            ? "disabled" : ""}`
        }
        style={endConversationButtonStyle}
        onClick={handleEndConversationButton}
      >
        <div style={{ display: 'flex', flexDirection: 'column'}}>
          <span style={endConversationButtonTextStyle}>
            Assess Understanding &
          </span>
          <span style={endConversationButtonTextStyle}>
            End Conversation
          </span>
        </div>
      </Button>

      {/* User Input Message Textarea */}
      <Textarea
        css={{ resize: "none" }}
        variant={"filled"}
        placeholder={"Enter your message here"}
        value={messageText}
        className={`chat-textarea ${waitingForResponse || disableAll.inputMessage ? "disable" : ""}`}
        style={inputTextareaStyle}
        onChange={handleChangeTextarea}
        onKeyDown={handleChatKeyDown}
      />

      {/* Send Button */}
      <Button
        style={sendButtonStyle}
        className={`send-button ${(waitingForResponse || disableAll.sendButton) ? "disabled" : ""}`}
        fontSize={"sm"}
        onClick={handleSubmit}
      >
        Send
      </Button>
    </HStack>
  );
};

export default SimpleChatBoxFooter;
