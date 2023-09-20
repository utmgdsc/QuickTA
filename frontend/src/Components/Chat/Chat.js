import { Box, Button, IconButton, Avatar } from "@chakra-ui/react";
import ChatBoxTopNav from "./ChatBoxTopNav";
import ChatBox from "./ChatBox";
import ChatBoxFooter from "./ChatBoxFooter";
import { useState, useEffect } from "react";
import CourseSelect from "../CourseSelect";
import ModelSelect from "../ModelSelect";
import { HamburgerIcon, SmallAddIcon } from "@chakra-ui/icons";
import axios from "axios";

const Chat = ({
  currCourse,
  courses,
  setCurrCourse,
  models,
  currModel,
  setCurrModel,
  userId,
}) => {
  const [messages, updateMessages] = useState([]);
  const [inConvo, updateInConvo] = useState(false);
  const [currConvoID, updateConvoID] = useState("");
  const [waitingForResp, setWaitForResp] = useState(false);
  const [openConvoHistory, setOpenConvoHistory] = useState(false);
  const [conversations, setConversations] = useState([]);

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
      });
  };

  const getConversationMessages = async () => {
    updateMessages([]);
    setWaitForResp(true);
    let params = `conversation_id=${currConvoID}&user_id=${userId}&course_id=${currCourse.course_id}`;
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
        }
        setWaitForResp(false);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const createNewConversation = async () => {
    axios
      .post(process.env.REACT_APP_API_URL + "/student/conversation", {
        user_id: userId,
        course_id: currCourse.course_id,
        model_id: currModel.model_id,
      })
      .then(async (res) => {
        updateConvoID(res.data.conversation_id);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    getConversations();
  }, [currCourse]);

  return (
    <>
      <Box ml={"12vw"} mr={"12vw"}>
        <div style={{ width: "315px" }}>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <CourseSelect
              courses={courses}
              currCourse={currCourse}
              setCurrCourse={setCurrCourse}
              wait={inConvo}
            />

            <ModelSelect
              models={models}
              currModel={currModel}
              setCurrModel={setCurrModel}
              wait={inConvo}
            />
          </div>
        </div>
        <Box
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
          }}
        >
          <Box
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
                justifyContent: "space-between",
                padding: "20px 16px",
                borderBottom: "1px solid #EAEAEA",
                alignItems: "center",
                backgroundColor: "#F9F9F9",
              }}
            >
              <div>
                <IconButton
                  border={"1px solid #EAEAEA"}
                  aria-label="Open Conversation History Menu"
                  size="sm"
                  icon={<HamburgerIcon />}
                  onClick={() => {
                    setOpenConvoHistory(!openConvoHistory);
                  }}
                />
              </div>
              {/* New Conversation button */}
              {openConvoHistory && (
                <div>
                  <Button
                    backgroundColor="#ACCDEC"
                    color="#555"
                    size="sm"
                    leftIcon={<SmallAddIcon />}
                    onClick={() => {
                      updateInConvo(false);
                      updateConvoID("");
                      updateMessages([]);
                      createNewConversation();
                    }}
                  >
                    New Conversation
                  </Button>
                </div>
              )}
            </div>

            <div
              style={{
                height: "100%",
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
                      style={{
                        background: "#F1F1F1",
                        display: "flex",
                        flexDirection: "row",
                        alignItems: "center",
                        padding: "10px",
                        borderBottom: "1px solid #EAEAEA",
                        cursor: "pointer",
                      }}
                      onClick={() => {
                        updateConvoID(convo.conversation_id);
                        updateInConvo(true);
                        getConversationMessages();
                      }}
                    >
                      <Avatar
                        name={convo.conversation_id}
                        backgroundColor="#7CA2DE"
                        style={{
                          width: "40px",
                          height: "40px",
                          borderRadius: "50%",
                          marginRight: "10px",
                          marginLeft: "5px",
                        }}
                        alt="User Avatar"
                      />
                      {openConvoHistory && (
                        <div>
                          {convo.conversation_name
                            ? convo.conversation_name
                            : `Conversation ${index + 1}`}
                        </div>
                      )}
                    </Box>
                  );
                })}
              </div>
            </div>
          </Box>
          <Box
            style={{
              minWidth: openConvoHistory ? "80%" : "calc(100% - 70px)",
            }}
          >
            <ChatBoxTopNav
              courseCode={currCourse.course_code}
              currConvoID={currConvoID}
            />
            <ChatBox messages={messages} waitingForResp={waitingForResp} />
            <ChatBoxFooter
              userId={userId}
              updateMessages={updateMessages}
              inConvo={inConvo}
              updateInConvo={updateInConvo}
              currConvoID={currConvoID}
              updateConvoID={updateConvoID}
              course_ID={currCourse.course_id}
              model_ID={currModel.model_id}
              messages={messages}
              waitingForResp={waitingForResp}
              setWaitForResp={setWaitForResp}
            />
          </Box>
        </Box>
      </Box>
    </>
  );
};

export default Chat;
