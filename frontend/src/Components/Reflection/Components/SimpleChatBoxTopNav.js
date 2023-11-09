import {
    Avatar,
    AvatarBadge,
    Button,
    HStack,
    Text,
    VStack,
    Heading,
    Textarea,
    Tooltip,
  } from "@chakra-ui/react";
  import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
  import { faBug, faDownload } from "@fortawesome/free-solid-svg-icons";
  import axios from "axios";
  import { useState } from "react";
  import Modal from '@mui/material/Modal';
  import Box from '@mui/material/Box';
  
  const SimpleChatBoxTopNav = ({ currentConversationId }) => {

    // Constants
    let COURSE_CODE = "CSC108H5";

    // States
    const [isOpen, setIsOpen] = useState(false);
    const fileDownload = require("js-file-download");
    const [reportMsg, setReportMsg] = useState("");

    // Styles
    const headerDivStyle = {
        display: "flex",
        borderBottom: "1px solid #EAEAEA",
        alignItems: "center",
        height: "15%",
        backgroundColor: "white",
        borderTopRightRadius: "8px",
      }

    const headerHStackStyle = {
        height: "100%",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        width: "100%",
        backgroundColor: "white",
    }

    const topNavLeftContainerStyle = {
      height: "100%",
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
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

    const headerTextStyle = {
      fontSize: "14px",
      marginLeft: "4px",
      lineHeight: "1.2",
    }

    const courseCodeHeadingStyle = {
      color: "#012E8A",
      fontWeight: "700",
      fontSize: "30px",
      marginLeft: "4px",
      lineHeight: "0.9",
    }

    const topNavRightContainerStyle = {
      display: "flex",
      alignItems: "center",
      maxWidth: "140px",
      height: "100%",
    }

    const downloadConversationButtonStyle = {
      padding: "8px",
      cursor: currentConversationId ? "pointer" : "not-allowed",
      color: currentConversationId ? "#012E8A" : "#aaa",
    }

    const downloadConversationButtonTextStyle = {
      wordWrap: "normal",
      whiteSpace: "normal",
      lineHeight: "1.2",
      fontWeight: "600",
    }

    const reportConversationButtonStyle = {
      padding: "8px",
      fontWeight: "600",
      cursor: currentConversationId ? "pointer" : "not-allowed",
      color: currentConversationId ? "#d63a3a" : "#aaa",
    }

    const reportConversationButtonTextStyle = {
      wordWrap: "normal",
      whiteSpace: "normal",
    }

    const rcModalStyle = {
      position: 'absolute',
      top: '30%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      width: '40%',
      bgcolor: 'background.paper',
      boxShadow: 10,
      pt: 2,
      px: 4,
      pb: 3,
      borderRadius: '8px',
      minWidth: '450px',
    }

    const rcModalTitleStyle = { 
      fontWeight: '600', 
      fontStyle: 'Poppins', 
      fontSize: '20px', 
      lineHeight: '30px' 
    }

    const rcModalTextareaStyle = { 
      marginTop: '10px',
      marginBottom: '10px',
      borderRadius: '8px',
      border: '1px solid #EAEAEA',
      padding: '10px',
    }

    // Functions
    const handleDownloadConversation = () => {
      if (currentConversationId) {
        axios.post(process.env.REACT_APP_API_URL + `/student/conversation/history/csv?conversation_id=${currentConversationId}`, { })
          .then((response) => {
            if (response.headers["content-disposition"]) {
              fileDownload( response.data, response.headers["content-disposition"].split('"')[1]);
            }
          })
          .catch((err) => { console.log(err) });
      } 
    }

    const handleReportConversationButton = () => { if (currentConversationId) { setIsOpen(true); } }

    const handleReportConversation = () => {
      if (reportMsg) {
        axios.post( 
          process.env.REACT_APP_API_URL + "/student/report",
          { conversation_id: currentConversationId, msg: reportMsg }
        ) 
        setIsOpen(false);
      }
    }

    return (
      <>
        <Box style={headerDivStyle}>
          <HStack paddingX={"12px"} style={headerHStackStyle} borderTopRightRadius={"8px"}>
            
            {/* Left container - avatar & header */}
            <Box style={topNavLeftContainerStyle}
            >
              {/* Avatar */}
              <Avatar style={avatarStyle}>
                <AvatarBadge boxSize={"1.2em"} style={avatarBadgeStyle} />
              </Avatar>
              {/* Header text */}
              <Box>
                <Text style={headerTextStyle}>Automated teaching assistant for </Text>
                <Heading style={courseCodeHeadingStyle}>{COURSE_CODE}</Heading>
              </Box>
            </Box>
  
            <Box
              className={`chatbox-topnav-buttons`}
              style={topNavRightContainerStyle}
            >
              {/* Download Conversation Button */}
              <Button
                variant={"ghost"}
                style={downloadConversationButtonStyle}
                className="top-nav-button"
                onClick={handleDownloadConversation}
              >
                <Tooltip
                  background={"#2F3747"}
                  color={"white"}
                  paddingX={2}
                  borderRadius={8}
                  fontSize={"sm"}
                  label={currentConversationId ? "This may take a couple of minutes" : "Start a new conversation first!"}
                >
                  <VStack>
                    <FontAwesomeIcon icon={faDownload} size={"lg"} />
                    <div className="top-nav-buttons-text">
                      <Text fontSize="2xs" style={downloadConversationButtonTextStyle}>Download Conversation</Text>
                    </div>
                  </VStack>
                </Tooltip>
              </Button>

              {/* Report Conversation Button */}
              <Button
               style={reportConversationButtonStyle}
                className="top-nav-button"
                variant={"ghost"}
                onClick={handleReportConversationButton}
              >
                <Tooltip
                  background={"#2F3747"}
                  color={"white"}
                  paddingX={2}
                  borderRadius={8}
                  fontSize={"sm"}  
                  label={currentConversationId ? "See a bug?" : "Start a new conversation first!"}
                >
                  <VStack>
                    <FontAwesomeIcon icon={faBug} size={"lg"} />
                    <div className="top-nav-buttons-text">
                      <Text fontSize="2xs" style={reportConversationButtonTextStyle}>
                        Report
                      </Text>
                    </div>
                  </VStack>
                </Tooltip>
              </Button>
            </Box>
            
            {/* Report Conversation Modal */}
            <Modal open={isOpen} onClose={() => setIsOpen(false)}>
              <Box sx={rcModalStyle}>
                <Box>
                  {/* Modal Header */}
                  <Box>
                    <span style={rcModalTitleStyle}>Report Bug</span>
                  </Box>
                  {/* Modal Body */}
                  <Textarea
                    css={{ resize: "none" }}
                    style={rcModalTextareaStyle}
                    placeholder={"Please try your best to describe the problem you encountered!"}
                    width={"100%"}
                    minBlockSize={"300px"}
                    onChange={(e) => setReportMsg(e.target.value)}
                  />
                  {/* Modal Footer */}
                  <Box>
                    <Button className="grey-button mr-3" style={{ marginRight: "8px" }} onClick={() => { setIsOpen(false); }}>
                      Close
                    </Button>
                    <Button className="red-button" onClick={handleReportConversation}> Report</Button>
                  </Box>
                </Box>
              </Box>
            </Modal>
          </HStack>
        </Box>
      </>
    );
  };
  
  export default SimpleChatBoxTopNav;
  