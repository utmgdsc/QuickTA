import {
  Avatar,
  AvatarBadge,
  Button,
  HStack,
  Text,
  VStack,
  Heading,
  Textarea,
} from "@chakra-ui/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBug, faDownload } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import { useState } from "react";
import { IconButton } from "@chakra-ui/react";
import { HamburgerIcon } from "@chakra-ui/icons";
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import Tooltip from "@mui/material/Tooltip";
import ReportConversationModal from "./ReportConversationModal";

const ChatBoxTopNav = ({
  courseCode,
  currConvoID,
  openConvoHistory,
  setOpenConvoHistory,
}) => {
  const fileDownload = require("js-file-download");

  // States
  const [isOpen, setIsOpen] = useState(false);
  const [reportMsg, setReportMsg] = useState("");
  const [error, setError] = useState();

  // Styles
  const topNavMasterContainerStyle = {
    display: "flex",
    borderBottom: "1px solid #EAEAEA",
    alignItems: "center",
    backgroundColor: "white",
    height: "15%",
    borderTopRightRadius: "8px",
  }

  const topNavSubContainerStyle = {
    paddingLeft: "12px",
    paddingRight: "12px",
    height: "100%",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    backgroundColor: "white",
    borderTopRightRadius: "8px",
  }

  const topNavLeftInnerContainerStyle = {
    height: "100%",
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
  }

  const openConvoHistoryButtonStyle = {
    backgroundColor: "white",
    border: "1px solid #EAEAEA",
    marginRight: "12px",
    marginLeft: "4px",
    marginBottom: "6px",
    padding: "8px",
    borderRadius: "8px",
  }

  const avatarStyle = { 
    background: "#A0AEBF",
    width: "60px",
    height: "60px",
    borderRadius: "50%",
    marginRight: "5px",
    marginLeft: "5px",
}

const avatarBadgeStyle = { 
  borderRadius: "60px", 
  border: "3px solid #C6F6D4",
  margin: 0,
  background: "#68D391"
}

const titleTextStyle = {
  fontSize: "14px",
  marginLeft: "4px",
  lineHeight: "1.2",
}

const courseTextStyle = {
  color: "#012E8A",
  fontWeight: "700",
  fontSize: "30px",
  marginLeft: "4px",
  lineHeight: "0.9",
}

const topNavRightInnerContainerStyle = {
  display: "flex",
  alignItems: "center",
  width: "140px",
  height: "100%",
}

const downloadConversationButtonStyle = {
  // padding: "3px",
  cursor: currConvoID ? "pointer" : "not-allowed",
  color: currConvoID ? "#012E8A" : "#aaa",
}

const tooltipStyle = {
  padding: "8px",
  borderRadius: "8px",
}

const downloadConversationSubtextStyle = {
  wordWrap: "normal",
  whiteSpace: "normal",
  lineHeight: "1.2",
  fontWeight: "600",
}

const reportConversationButtonStyle = {
  fontWeight: "600",
  cursor: currConvoID ? "pointer" : "not-allowed",
  color: currConvoID ? "#d63a3a" : "#aaa",
}

const reportConversationSubtextStyle = {
  wordWrap: "normal",
  whiteSpace: "normal"
}

// Downloads the conversation history as a CSV file.
const handleDownloadConversation = () => {
  if (currConvoID) {
    axios.post(
        process.env.REACT_APP_API_URL + `/student/conversation/history/csv`,
        { conversation_id: currConvoID }
      )
      .then((response) => {
        if (response.headers["content-disposition"]) {
          fileDownload(response.data, response.headers["content-disposition"].split('"')[1]);
        }
      })
  } 
}

const handleOpenReportConversationModal = () => { if (currConvoID) { setIsOpen(true); } }


  return (
    <>
      <div style={topNavMasterContainerStyle}>
        <HStack style={topNavSubContainerStyle}>
          <div style={topNavLeftInnerContainerStyle}>
            {/* Hamburger icon for smaller screens */}
            {!openConvoHistory && (
              <div className="hamburger-icon-div">
                <IconButton
                  className="hamburger-icon"
                  aria-label="Open Conversation History Menu"
                  size="sm"
                  icon={<HamburgerIcon />}
                  onClick={() => {setOpenConvoHistory(true);}}
                  style={openConvoHistoryButtonStyle}
                />
              </div>
            )}
            <Avatar style={avatarStyle}>
              <AvatarBadge boxSize={"1.25em"} style={avatarBadgeStyle} />
            </Avatar>
            <div>
              <Text style={titleTextStyle}>
                Automated teaching assistant for
              </Text>
              <Heading style={courseTextStyle}>
                {courseCode}
              </Heading>
            </div>
          </div>

          <div
            className={`chatbox-topnav-buttons`}
            style={topNavRightInnerContainerStyle}
          >
            {/* Download Conversation Button */}
            <Button
              size="xs"
              variant={"ghost"}
              style={downloadConversationButtonStyle}
              className="top-nav-button"
              onClick={handleDownloadConversation}
            >
              <Tooltip
                style={tooltipStyle}
                title={
                  currConvoID !== ""
                    ? "This may take a couple of minutes"
                    : "Start a new conversation first!"
                }
              >
                <VStack>
                  <FontAwesomeIcon icon={faDownload} size={"lg"} />
                  <div className="top-nav-buttons-text">
                    <Text
                      fontSize="2xs"
                      style={downloadConversationSubtextStyle}
                    >
                      Download Conversation
                    </Text>
                  </div>
                </VStack>
              </Tooltip>
            </Button>
            {/* Report Conversation Button */}
            <Button
              style={reportConversationButtonStyle}
              className="top-nav-button"
              variant={"ghost"}
              onClick={handleOpenReportConversationModal}
            >
              <Tooltip
                style={tooltipStyle}
                title={ currConvoID ? "See a bug?" : "Start a new conversation first!"}
              >
                <VStack>
                  <FontAwesomeIcon icon={faBug} size={"lg"} />
                  <div className="top-nav-buttons-text">
                    <Text fontSize="2xs" style={reportConversationSubtextStyle}>
                      Report
                    </Text>
                  </div>
                </VStack>
              </Tooltip>
            </Button>
          </div>

          {/* Report Conversation Modal */}
          <ReportConversationModal
            isOpen={isOpen}
            setIsOpen={setIsOpen}
            conversationId={currConvoID}
          />
        </HStack>
      </div>
      {/* <ErrorDrawer error={error} isOpen={isErrOpen} onClose={onErrClose} /> */}
    </>
  );
};

export default ChatBoxTopNav;
