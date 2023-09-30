import {
  Box,
  Button,
  IconButton,
  Avatar,
  AvatarBadge,
  useDisclosure,
  Text,
  VStack,
} from "@chakra-ui/react";
import ChatBoxTopNav from "./ChatBoxTopNav";
import ChatBox from "./ChatBox";
import ChatBoxFooter from "./ChatBoxFooter";
import { useState, useEffect } from "react";
import CourseSelect from "../CourseSelect";
import ModelSelect from "../ModelSelect";
import { CloseIcon, HamburgerIcon, SmallAddIcon } from "@chakra-ui/icons";
import axios from "axios";
import "../../assets/styles.css";
import ErrorDrawer from "../ErrorDrawer";
import { Temporal } from "@js-temporal/polyfill";

const Chat = ({
  currCourse,
  courses,
  setCurrCourse,
  models,
  currModel,
  setCurrModel,
  userId,
  waitingForResp,
  setWaitForResp,
  model_id,
  UTORid,
  auth,
}) => {
  const [messages, updateMessages] = useState([
    {
      message:
        "Hi! I am an AI assistant designed to support you in your Python programming learning journey. I cannot give out solutions to your assignments (python code) but I can help guide you if you get stuck. How can I help you?",
      dateSent: Temporal.Now.zonedDateTimeISO().toString(),
      isUser: false,
    },
  ]);
  const [inConvo, updateInConvo] = useState(false);
  const [currConvoID, updateConvoID] = useState("");
  const [openConvoHistory, setOpenConvoHistory] = useState(false);
  const [conversations, setConversations] = useState([]);
  const [isOldConvo, setIsOldConvo] = useState(false);
  const [text, setText] = useState("");
  const {
    isOpen: isErrOpen,
    onOpen: onErrOpen,
    onClose: onErrClose,
  } = useDisclosure();
  const {
    isOpen: isOpenTechAssessment,
    onOpen: onOpenTechAssessment,
    onClose: onCloseTechAssessment,
  } = useDisclosure();
  const [error, setError] = useState();
  const [disableAll, setDisableAll] = useState({
    newConversation: false,
    endChat: false,
    inputMessage: false,
    sendButton: false,
    oldConvoButtons: false,
  });

  const getConversations = async () => {
    let params = "course_id=" + currCourse.course_id + "&user_id=" + userId;
    axios
      .get(
        process.env.REACT_APP_API_URL +
          `/student/conversation/history?${params}`
      )
      .then((res) => {
        let data = res.data;
        if (data.conversations) setConversations(data.conversations);
      })
      .catch((err) => {
        setError(err);
        console.log(err);
        onErrOpen();
      });
  };

  const getConversationMessages = async (convoID) => {
    updateMessages([]);
    setWaitForResp(true);
    let params = `conversation_id=${convoID}&user_id=${userId}&course_id=${currCourse.course_id}`;
    axios
      .get(
        process.env.REACT_APP_API_URL +
          `/student/conversation/chatlog?${params}`
      )
      .then((res) => {
        let data = res.data;
        if (data.chatlogs) {
          let msgs = data.chatlogs.map((msg) => {
            return {
              message: msg.chatlog,
              dateSent: msg.time,
              isUser: msg.is_user == true ? "true" : "false",
            };
          });
          updateMessages(msgs);
          console.log(msgs);
        }
        setWaitForResp(false);
      })
      .catch((err) => {
        setError(err);
        console.log(err);
        onErrOpen();
      });
  };

  const createNewConversation = async () => {
    console.log(model_id.length === 0 ? currModel.model_id : model_id);
    updateMessages([
      {
        message:
          "Hi! I am an AI assistant designed to support you in your Python programming learning journey. I cannot give out solutions to your assignments (python code) but I can help guide you if you get stuck. How can I help you?",
        dateSent: Temporal.Now.zonedDateTimeISO().toString(),
        isUser: false,
      },
    ]);
    // axios
    //   .post(process.env.REACT_APP_API_URL + "/student/conversation", {
    //     user_id: userId,
    //     course_id: currCourse.course_id,
    //     model_id: model_id.length === 0 ? currModel.model_id : model_id,
    //   })
    //   .then(async (res) => {
    //     updateConvoID(res.data.conversation_id);
    //     updateInConvo(true);
    //   })
    //   .catch((err) => {
    //     setError(err);
    //     console.log(err);
    //     onErrOpen();
    //   });
  };

  useEffect(() => {
    getConversations();
  }, [currCourse]);

  return (
    <>
      <Box ml={"10vw"} mr={"10vw"} style={{
        minHeight: "fit-content",
      }}>
        <div style={{ width: "500px" }}>
          <div style={{ display: "flex" }}>
            <CourseSelect
              courses={courses}
              currCourse={currCourse}
              setCurrCourse={setCurrCourse}
              inConvo={inConvo}
            />
            {auth !== "ST" && (
              <ModelSelect
                models={models}
                model={model_id}
                currModel={currModel}
                setCurrModel={setCurrModel}
                inConvo={inConvo}
              />
            )}
          </div>
        </div>
        <VStack
          as={"div"}
          bgColor={"white"}
          border={"1px solid #EAEAEA"}
          borderTopRadius={"lg"}
          borderBottomRadius={"lg"}
          boxShadow={"1px 2px 3px 1px rgba(0,0,0,0.12)"}
          style={{
            maxHeight: "75vh",
            display: "flex",
            flexDirection: "row",
            minHeight: "fit-content",
          }}
        >
          <Box
            className={
              `conversation-history-bar` +
              (openConvoHistory
                ? " full-width conversation-history-bar-full-height"
                : " hidden")
            }
            borderBottomLeftRadius={"lg"}
            style={{
              width: openConvoHistory ? "20%" : "70px",
              height: "100%",
              overflow: "hidden", // Hide the horizontal overflow
            }}
          >
            <div
              style={{
                display: "flex",
                width: "100%",
                height: "fit-content",
                padding: "20px 16px",
                borderBottom: "1px solid #EAEAEA",
                alignItems: "center",
                backgroundColor: "#F9F9F9",
                borderTopLeftRadius: "5px",
                borderTopRightRadius: "5px",
              }}
            >
              <div>
                <IconButton
                  border={"1px solid #EAEAEA"}
                  aria-label="Open Conversation History Menu"
                  size="sm"
                  icon={openConvoHistory ? <CloseIcon /> : <HamburgerIcon />}
                  onClick={() => {
                    setOpenConvoHistory(!openConvoHistory);
                  }}
                />
              </div>
              {/* New Conversation button */}
              {openConvoHistory && (
                <div
                  style={{
                    display: "flex",
                    justifyContent: "flex-end",
                    width: "100%",
                  }}
                >
                  <Button
                    backgroundColor="#ACCDEC"
                    color="#555"
                    size="sm"
                    icon={<SmallAddIcon />}
                    isDisabled={
                      waitingForResp ||
                      (disableAll.newConversation && messages.length === 1) ||
                      (!inConvo && !currConvoID && !isOldConvo)
                    }
                    onClick={() => {
                      if (
                        (currConvoID && inConvo && !isOldConvo) ||
                        (inConvo && isOldConvo)
                      ) {
                        // open technical assessment
                        onOpenTechAssessment();
                      } else {
                        setDisableAll((prevDisableAll) => ({
                          inputMessage: false,
                          sendButton: false,
                          newConversation: true,
                          endChat: false,
                          oldConvoButtons: false,
                        }));
                        updateInConvo(false);
                        updateConvoID("");
                        setIsOldConvo(false);
                        updateMessages([]);
                        createNewConversation();
                      }
                    }}
                    overflow={"hidden"}
                    whiteSpace={"nowrap"}
                    textOverflow={"ellipsis"}
                    ms={2}
                  >
                    <Text
                      overflow={"hidden"}
                      whiteSpace={"nowrap"}
                      textOverflow={"ellipsis"}
                    >
                      New Conversation
                    </Text>
                  </Button>
                </div>
              )}
            </div>

            <div
              style={{
                height: "fit-content",
                overflowY: "auto", // Enable vertical scrolling if needed
                maxHeight: "calc(75vh - 100px)", // Set a maximum height
              }}
            >
              <div>
                {conversations.map((convo, index) => {
                  return (
                    <Box
                      key={convo.conversation_id}
                      className="conversation-history-box"
                      style={
                        disableAll.oldConvoButtons
                          ? {
                              background: "#F1F1F1",
                              display: "flex",
                              flexDirection: "row",
                              alignItems: "center",
                              padding: "10px",
                              borderBottom: "1px solid #EAEAEA",
                              cursor: "not-allowed",
                              width: "100%",
                            }
                          : {
                              background: "#F1F1F1",
                              display: "flex",
                              flexDirection: "row",
                              alignItems: "center",
                              padding: "10px",
                              borderBottom: "1px solid #EAEAEA",
                              cursor: "pointer",
                              width: "100%",
                            }
                      }
                      onClick={() => {
                        if (disableAll.oldConvoButtons) return;
                        if (currConvoID !== convo.conversation_id) {
                          setText("");
                          if (convo.status == "A") {
                            // active old conversation
                            setIsOldConvo(true);
                            updateInConvo(true);
                            updateConvoID(convo.conversation_id);
                            setDisableAll((prevDisableAll) => ({
                              inputMessage: false,
                              sendButton: false,
                              newConversation: false,
                              endChat: false,
                              oldConvoButtons: false,
                            }));
                          } else {
                            // Inactive old conversation
                            updateConvoID(convo.conversation_id);
                            setIsOldConvo(true);
                            updateInConvo(false);
                            setDisableAll((prevDisableAll) => ({
                              inputMessage: true,
                              sendButton: true,
                              newConversation: false,
                              endChat: true,
                              oldConvoButtons: false,
                            }));
                          }
                        } else {
                          // current ongoing conversation
                          setDisableAll((prevDisableAll) => ({
                            inputMessage: false,
                            sendButton: false,
                            newConversation: false,
                            endChat: false,
                            oldConvoButtons: false,
                          }));
                        }
                        getConversationMessages(convo.conversation_id);
                      }}
                    >
                      <Avatar
                        name={
                          convo.conversation_name
                            ? convo.conversation_name
                            : "C " + (index + 1)
                        }
                        backgroundColor="#7CA2DE"
                        style={{
                          width: "40px",
                          height: "40px",
                          borderRadius: "50%",
                          marginRight: "10px",
                          marginLeft: "5px",
                        }}
                        alt="User Avatar"
                      >
                        <AvatarBadge
                          boxSize={"16px"}
                          borderColor={
                            convo.status == "A" ? "green.100" : "papayawhip"
                          }
                          bg={convo.status == "A" ? "green.300" : "tomato"}
                        />
                      </Avatar>
                      {openConvoHistory && (
                        <span
                          style={{
                            fontSize: "14px",
                            fontWeight: "500",
                            whiteSpace: "nowrap",
                            overflow: "hidden", // Hide any overflowing text
                            textOverflow: "ellipsis", // Display ellipsis for overflow
                            maxWidth: "100%", // Adju
                          }}
                        >
                          {convo.conversation_name
                            ? convo.conversation_name
                            : `Conversation ${conversations.length - index}`}
                        </span>
                      )}
                    </Box>
                  );
                })}
              </div>
            </div>
          </Box>
          <Box
            className={
              `chat-box` + (openConvoHistory ? " hidden" : " full-width")
            }
            style={{ 
              minWidth: openConvoHistory ? "80%" : "calc(100% - 70px)",
              maxHeight: "75vh",
           }}
          >
            <div
              style={{
                display: "flex",
                borderBottom: "1px solid #EAEAEA",
                alignItems: "center",
                backgroundColor: "#F9F9F9",
              }}
            >
              <ChatBoxTopNav
                openConvoHistory={openConvoHistory}
                setOpenConvoHistory={setOpenConvoHistory}
                courseCode={currCourse.course_code}
                currConvoID={currConvoID}
              />
            </div>
            <ChatBox messages={messages} waitingForResp={waitingForResp} />
            <ChatBoxFooter
              userId={userId}
              setIsOldConvo={setIsOldConvo}
              updateMessages={updateMessages}
              inConvo={inConvo}
              updateInConvo={updateInConvo}
              currConvoID={currConvoID}
              updateConvoID={updateConvoID}
              model_id={model_id}
              course_ID={currCourse.course_id}
              model_ID={currModel.model_id}
              messages={messages}
              waitingForResp={waitingForResp}
              setWaitForResp={setWaitForResp}
              disableAll={disableAll}
              setDisableAll={setDisableAll}
              conversations={conversations}
              setConversations={setConversations}
              isOpenTechAssessment={isOpenTechAssessment}
              onOpenTechAssessment={onOpenTechAssessment}
              onCloseTechAssessment={onCloseTechAssessment}
              UTORid={UTORid}
              text={text}
              setText={setText}
            />
          </Box>
        </VStack>
      </Box>
      <ErrorDrawer error={error} isOpen={isErrOpen} onClose={onErrClose} />
    </>
  );
};

export default Chat;
