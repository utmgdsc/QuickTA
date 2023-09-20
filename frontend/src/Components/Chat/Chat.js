import {
  Box,
  Button,
  IconButton,
  useRadio,
  HStack,
  Spacer,
  Avatar,
} from "@chakra-ui/react";
import ChatBoxTopNav from "./ChatBoxTopNav";
import ChatBox from "./ChatBox";
import ChatBoxFooter from "./ChatBoxFooter";
import { useState, useEffect } from "react";
import CourseSelect from "../CourseSelect";
import ModelSelect from "../ModelSelect";
import { HamburgerIcon, SmallAddIcon } from "@chakra-ui/icons";

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
  const [conversations, setConversations] = useState([
    {
      conversation_id: "1",
      conversation_name: "Conversation 1",
      avatar: "https://i.imgur.com/2WZtUZa.png",
    },
    {
      conversation_id: "2",
      conversation_name: "Conversation 2",
      avatar: "https://i.imgur.com/2WZtUZa.png",
    },
    {
      conversation_id: "3",
      conversation_name: "Conversation 3",
      avatar: "https://i.imgur.com/2WZtUZa.png",
    },
    {
      conversation_id: "4",
      conversation_name: "Conversation 4",
      avatar: "https://i.imgur.com/2WZtUZa.png",
    },
    {
      conversation_id: "5",
      conversation_name: "Conversation 5",
      avatar: "https://i.imgur.com/2WZtUZa.png",
    },
    {
      conversation_id: "6",
      conversation_name: "Conversation 6",
      avatar: "https://i.imgur.com/2WZtUZa.png",
    },
    {
      conversation_id: "7",
      conversation_name: "Conversation 7",
      avatar: "https://i.imgur.com/2WZtUZa.png",
    },
    {
      conversation_id: "8",
      conversation_name: "Conversation 8",
      avatar: "https://i.imgur.com/2WZtUZa.png",
    },
    {
      conversation_id: "9",
      conversation_name: "Conversation 9",
      avatar: "https://i.imgur.com/2WZtUZa.png",
    },
    {
      conversation_id: "A",
      conversation_name: "Conversation 10",
      avatar: "https://i.imgur.com/2WZtUZa.png",
    },
    {
      conversation_id: "B",
      conversation_name: "Conversation 11",
      avatar: "https://i.imgur.com/2WZtUZa.png",
    },
    {
      conversation_id: "12",
      conversation_name: "Conversation 12",
      avatar: "https://i.imgur.com/2WZtUZa.png",
    },
    {
      conversation_id: "13",
      conversation_name: "Conversation 13",
      avatar: "https://i.imgur.com/2WZtUZa.png",
    },
    {
      conversation_id: "14",
      conversation_name: "Conversation 14",
      avatar: "https://i.imgur.com/2WZtUZa.png",
    },
    {
      conversation_id: "15",
      conversation_name: "Conversation 15",
      avatar: "https://i.imgur.com/2WZtUZa.png",
    },
    {
      conversation_id: "16",
      conversation_name: "Conversation 16",
      avatar: "https://i.imgur.com/2WZtUZa.png",
    },
  ]);

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
                      console.log("New Conversation button clicked!");
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
                {conversations.map((convo) => {
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
                      hover={{
                        background: "#D1D1D1",
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
                      {openConvoHistory && <div>{convo.conversation_name}</div>}
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
