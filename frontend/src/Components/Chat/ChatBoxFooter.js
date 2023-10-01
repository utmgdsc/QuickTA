import {
  Button,
  HStack,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Radio,
  RadioGroup,
  Text,
  Textarea,
  VStack,
  useDisclosure,
} from "@chakra-ui/react";
import { useState, useEffect } from "react";
import axios from "axios";
import { Temporal } from "@js-temporal/polyfill";
import TechAssessment from "./TechAssessment";
import ChatOpenSurvey from "./ChatOpenSurvey";
import ErrorDrawer from "../ErrorDrawer";

const ChatBoxFooter = ({
  updateMessages,
  setIsOldConvo,
  inConvo,
  currConvoID,
  updateInConvo,
  updateConvoID,
  course_ID,
  messages,
  waitingForResp,
  setWaitForResp,
  userId,
  disableAll,
  setDisableAll,
  conversations,
  setConversations,
  model_id,
  model_ID,
  UTORid,
  isOpenTechAssessment,
  onOpenTechAssessment,
  onCloseTechAssessment,
  text,
  setText,
}) => {
  // after conversations ends disclosure
  const {
    isOpen: isErrOpen,
    onOpen: onErrOpen,
    onClose: onErrClose,
  } = useDisclosure();
  const [error, setError] = useState();

  const handleChatKeyDown = (e) => {
    if ((e.key === "Enter" || e.keyCode === 13) && !e.shiftKey) {
      if (text) {
        handleSubmit();
      }
    }
  };

  const getResponse = async (
    conversation_id,
    response,
    currConversations,
    loadText
  ) => {
    // Load user message on click
    const now = Temporal.Now.zonedDateTimeISO().toString();
    if (!loadText) {
      const userText = {
        message: text ? text : response,
        dateSent: now,
        isUser: "true",
      };
      updateMessages((oldMessage) => [...oldMessage, userText]);
    }
    axios
      .post(process.env.REACT_APP_API_URL + "/student/chatlog", {
        conversation_id: currConvoID ? currConvoID : conversation_id,
        chatlog: text,
        time: now,
      })
      .then((response) => {
        const agentResponse = {
          message: response.data.agent.chatlog,
          dateSent: response.data.agent.time,
          isUser: "false",
        };
        updateMessages((oldMessage) => [...oldMessage, agentResponse]);
        setWaitForResp(false);
        setText("");

        // Update conversation name for new conversations
        if (currConversations) {
          let new_convo = currConversations[0];
          new_convo = {
            ...new_convo,
            conversation_name: response.data.conversation_name,
          };

          let new_conversations = [new_convo, ...currConversations.slice(1)];
          setConversations(new_conversations);
        }
        setDisableAll((oldDisable) => ({
          ...oldDisable,
          oldConvoButtons: false,
          endChat: false,
        }));
      })
      .catch((err) => {
        // console.log(err);
        if (err.response.data.error.msg) {
          setError(err.response.data.error.msg);
          onErrOpen();
        }
        setDisableAll((oldDisable) => ({
          ...oldDisable,
          oldConvoButtons: false,
          endChat: false,
          newConversation: false,
          sendButton: false,
          inputMessage: false,
        }));
      });
  };

  const handleSubmit = async () => {
    if (inConvo) {
      if (text) {
        setWaitForResp(true);
        // console.log("Disabling old convo buttons");
        setDisableAll((oldDisable) => ({
          ...oldDisable,
          oldConvoButtons: true,
        }));
        await getResponse();
      } else {
        // console.log("You must type something before asking AI for response :)");
      }
    } else {
      // console.log("must start a conversation to send a message to AI!");
      if (text) {
        setWaitForResp(true);
        // console.log("Disabling old convo buttons");
        setDisableAll((oldDisable) => ({
          ...oldDisable,
          oldConvoButtons: true,
        }));

        const now = Temporal.Now.zonedDateTimeISO().toString();
        const userText = {
          message: text.slice(0, 4000),
          dateSent: now,
          isUser: "true",
        };
        updateMessages((oldMessage) => [...oldMessage, userText]);

        axios
          .post(process.env.REACT_APP_API_URL + "/student/conversation", {
            user_id: userId,
            course_id: course_ID,
            model_id: model_id.length === 0 ? model_ID : model_id,
          })
          .then(async (res) => {
            let data = res.data;
            updateConvoID(data.conversation_id);
            updateInConvo(true);
            setWaitForResp(true);
            setText("");
            setIsOldConvo(false);

            data["conversation_name"] = "New Conversation";
            let currConversations = [res.data, ...conversations];
            setConversations(currConversations);

            let conversation_id = res.data.conversation_id;
            let chatlog = text;

            await getResponse(
              conversation_id,
              chatlog,
              currConversations,
              true
            );
          })
          .catch((err) => {
            // console.log(err);
            setError(err);
            // console.log(err);
            onErrOpen();
            setWaitForResp(false);
          });
      }
    }
  };

  return (
    <>
      <HStack
        bgColor={"white"}
        paddingX={"3vw"}
        paddingTop={"6px"}
        paddingBottom={"4px"}
        borderTop={"2px solid #EAEAEA"}
        borderBottomRightRadius={"8px"}
      >
        <Button
          colorScheme={"red"}
          fontSize={"sm"}
          onClick={() => {
            if (inConvo && messages) {
              onOpenTechAssessment();
            } else {
              // console.log(
              //   "Must be in a convo to leave one or please send at least one msg :>"
              // );
            }
          }}
          isDisabled={
            (!inConvo && messages.length == 1) ||
            disableAll.endChat ||
            waitingForResp
          }
        >
          End chat
        </Button>

        <TechAssessment
          isOpenTechAssessment={isOpenTechAssessment}
          onOpenTechAssessment={onOpenTechAssessment}
          onCloseTechAssessment={onCloseTechAssessment}
          conversation_id={currConvoID}
          updateConvoID={updateConvoID}
          updateInConvo={updateInConvo}
          updateMessages={updateMessages}
          UTORid={UTORid}
          disableAll={disableAll}
          setDisableAll={setDisableAll}
          conversations={conversations}
          setConversations={setConversations}
        />

        <Textarea
          css={{ resize: "none" }}
          variant={"filled"}
          placeholder={"Enter your message here"}
          value={text}
          onChange={(e) => {
            setText(e.target.value.slice(0, process.env.MAX_MESSAGE_LENGTH));
          }}
          isDisabled={waitingForResp || disableAll.inputMessage}
          onKeyDown={handleChatKeyDown}
        />

        <Button
          backgroundColor={"#3278cd"}
          colorScheme={"blue"}
          fontSize={"sm"}
          onClick={handleSubmit}
          isDisabled={waitingForResp || disableAll.sendButton}
        >
          Send
        </Button>
      </HStack>
      <ErrorDrawer error={error} isOpen={isErrOpen} onClose={onErrClose} />
    </>
  );
};

export default ChatBoxFooter;
