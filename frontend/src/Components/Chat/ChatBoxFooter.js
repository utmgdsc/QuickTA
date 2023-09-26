import {
  Button,
  HStack,
  Input,
  Tooltip,
  useDisclosure,
} from "@chakra-ui/react";
import { useState, useEffect } from "react";
import axios from "axios";
import { Temporal } from "@js-temporal/polyfill";
import FeedbackSurvey from "./FeedbackSurvey";
import ChatOpenSurvey from "./ChatOpenSurvey";
import ErrorDrawer from "../ErrorDrawer";

const ChatBoxFooter = ({
  updateMessages,
  inConvo,
  updateInConvo,
  currConvoID,
  updateConvoID,
  course_ID,
  messages,
  waitingForResp,
  setWaitForResp,
  userId,
  model_ID,
  disableAll,
  conversations,
  setConversations,
}) => {
  const {
    isOpen: isOpenFeedback,
    onOpen: onOpenFeedback,
    onClose: onCloseFeedback,
  } = useDisclosure();
  // after conversations ends disclosure
  const {
    isOpen: isOpenComfortability,
    onOpen: onOpenComfortability,
    onClose: onCloseComfortability,
  } = useDisclosure();
  const {
    isOpen: isErrOpen,
    onOpen: onErrOpen,
    onClose: onErrClose,
  } = useDisclosure();
  const [error, setError] = useState();
  const [sliderVal, setSliderVal] = useState(0);
  const [text, setText] = useState("");

  const handleChatKeyDown = (e) => {
    if (e.key === "Enter" || e.keyCode === 13) {
      if (text) {
        handleSubmit();
      }
    }
  };

  const getResponse = async (conversation_id, response) => {
    // Load user message on click
    const now = Temporal.Now.zonedDateTimeISO().toString();
    const userText = {
      message: text ? text : response,
      dateSent: now,
      isUser: "true",
    };
    updateMessages((oldMessage) => [...oldMessage, userText]);
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

        // Update conversation name
        let new_convo = conversations[0];
        new_convo = {
          ...new_convo,
          conversation_name: response.data.conversation_name,
        };
        console.log("old", conversations);
        let new_conversations = [new_convo, ...conversations.slice(1)];
        console.log(new_conversations);
        setConversations(new_conversations);
      })
      .catch((err) => {
        setError(err);
        onErrOpen();
      });
  };

  const handleSubmit = async () => {
    if (inConvo) {
      if (text) {
        setWaitForResp(true);
        await getResponse();
      } else {
        console.log("You must type something before asking AI for response :)");
      }
    } else {
      // console.log("must start a conversation to send a message to AI!");
      if (text) {
        setWaitForResp(true);
        axios
          .post(process.env.REACT_APP_API_URL + "/student/conversation", {
            user_id: userId,
            course_id: course_ID,
            model_id: model_ID,
          })
          .then(async (res) => {
            let data = res.data;
            updateConvoID(data.conversation_id);
            updateInConvo(true);
            setWaitForResp(true);
            setText("");
            data["conversation_name"] = ".....";
            setConversations([res.data, ...conversations]);
            let conversation_id = res.data.conversation_id;
            let chatlog = text;
            await getResponse(conversation_id, chatlog);
          })
          .catch((err) => {
            setError(err);
            onErrOpen();
          });
      }
    }
  };

  return (
    <>
      <HStack
        bgColor={"white"}
        p={5}
        paddingX={"3vw"}
        borderTop={"2px solid #EAEAEA"}
      >
        <Button
          colorScheme={"red"}
          fontSize={"sm"}
          onClick={() => {
            if (inConvo && messages) {
              console.log(messages);
              onOpenFeedback();
            } else {
              console.log(
                "Must be in a convo to leave one or please send at least one msg :>"
              );
            }
          }}
          isDisabled={
            !inConvo || (inConvo && messages.length == 0) || disableAll
          }
        >
          End chat
        </Button>

        <FeedbackSurvey
          isOpen={isOpenFeedback}
          onClose={onCloseFeedback}
          conversation_id={currConvoID}
          updateConvoID={updateConvoID}
          updateInConvo={updateInConvo}
          updateMessages={updateMessages}
        />

        <Input
          variant={"filled"}
          placeholder={"Enter your message here"}
          value={text}
          onChange={(e) => {
            setText(e.target.value.slice(0, process.env.MAX_MESSAGE_LENGTH));
          }}
          isDisabled={waitingForResp || disableAll}
          onKeyDown={handleChatKeyDown}
        />

        <Button
          backgroundColor={"#3278cd"}
          colorScheme={"blue"}
          fontSize={"sm"}
          onClick={handleSubmit}
          isDisabled={waitingForResp || disableAll}
        >
          Send
        </Button>
      </HStack>
      <ErrorDrawer error={error} isOpen={isErrOpen} onClose={onErrClose} />
    </>
  );
};

export default ChatBoxFooter;
