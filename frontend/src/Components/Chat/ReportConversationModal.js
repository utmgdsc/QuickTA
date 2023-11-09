import React, { useState } from "react";
import { Button, Textarea } from "@chakra-ui/react";
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import axios from "axios";

const ReportConversationModal = ({ isOpen, setIsOpen, conversationId }) => {

  const textAreaPlaceholder ="Please try your best to describe the problem you encountered!"
  const [reportMsg, setReportMsg] = useState("");

  const modalContainerBoxStyle = {
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

  const modalHeaderTextStyle = { 
    fontWeight: '600', 
    fontStyle: 'Poppins', 
    fontSize: '20px', 
    lineHeight: '30px' 
  }

  const textAreaStyle = { 
    marginTop: '10px',
    marginBottom: '10px',
    borderRadius: '8px',
    border: '1px solid #EAEAEA',
    padding: '10px',
  }

  const handleReportConversation = () => {
    if (reportMsg) {
      axios.post(
          process.env.REACT_APP_API_URL + "/student/report",
          {
            conversation_id: conversationId,
            msg: reportMsg,
          }
        )
        .then((res) => {})
        .catch((err) => {});
      setIsOpen(false);
    }
  }

  const handleTextAreaChange = (e) => setReportMsg(e.target.value)
  const handleClose = () => { setIsOpen(false); }
  return (
    <Modal open={isOpen} onClose={handleClose}>
      <Box sx={modalContainerBoxStyle}>
        <Box>
          <Box>
            <span style={modalHeaderTextStyle}>Report Bug</span>
          </Box>
          <Textarea
            css={{ resize: "none" }}
            style={textAreaStyle}
            placeholder={textAreaPlaceholder}
            width={"100%"}
            minBlockSize={"300px"}
            onChange={handleTextAreaChange}
          />
          <Box>
            <Button
              className="grey-button mr-3"
              onClick={handleClose}
            >
              Close
            </Button>
            <Button 
              className="red-button" 
              onClick={handleReportConversation}
            >
              Report
            </Button>
          </Box>
        </Box>
      </Box>
    </Modal>
  )
};

export default ReportConversationModal;