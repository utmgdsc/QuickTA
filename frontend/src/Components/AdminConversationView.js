import {
  Button,
  Table,
  Tbody,
  Td,
  Thead,
  Tr,
  useDisclosure,
} from "@chakra-ui/react";
import axios from "axios";
import React, { useEffect, useState } from "react";
import ErrorDrawer from "./ErrorDrawer";
import Box from '@mui/material/Box';
import Modal from "@mui/material/Modal";
import Grid from '@mui/material/Grid';
import TextareaAutosize from '@mui/material/TextareaAutosize';


const AdminConversationView = ({convo_id, isOpen, onClose, model_id, UTORID}) => {
const [convo, setConvo] = useState([]);
const [prompt, setPrompt] = useState('');
  const fileDownload = require("js-file-download");
  const {
    isOpen: isErrOpen,
    onOpen: onErrOpen,
    onClose: onErrClose,
  } = useDisclosure();
  const [error, setError] = useState();
  const fetchConversation = async (conversation_id) => {
    await axios
      .get(
        process.env.REACT_APP_API_URL +
          `/student/conversation/chatlog?conversation_id=${convo_id}`
      )
      .then((res) => {
        if(res.data){
          setConvo(res.data.chatlogs);
          fetchPrompt(model_id);
        }

      })
      .catch((err) => {
        setError(err);
        // console.log(err);
        onErrOpen();
      });
  };

  function parseTime(time) {
    // Create a Date object from the input time string
    const inputDate = new Date(time);

    // Create a DateTimeFormat object with the desired format
    const formatter = new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      timeZoneName: "long",
    });

    // Format the date in the desired format and time zone
    const formattedTime = formatter.formatToParts(inputDate);

    // Extract the relevant parts for the final format
    const year = formattedTime.find((part) => part.type === "year").value;
    const month = formattedTime.find((part) => part.type === "month").value;
    const day = formattedTime.find((part) => part.type === "day").value;
    const hour = formattedTime.find((part) => part.type === "hour").value;
    const minute = formattedTime.find((part) => part.type === "minute").value;
    const second = formattedTime.find((part) => part.type === "second").value;
    const timeZoneName = formattedTime.find(
      (part) => part.type === "timeZoneName"
    ).value;

    // Create the final formatted string
    const formattedString = `${year}-${month}-${day} ${hour}:${minute}:${second} [${timeZoneName}]`;

    return formattedString;
  }
  // function parseDelta(delta) {
  //   if (delta) {
  //     // Split the input string by empty string and : to extract components
  //     let components = delta.split(/(\d+\.\d+|\d+|\.\d+)/g);
  //     components = components.filter((component) => component !== "");
  //     components = components.filter((component) => component !== ":");
  //
  //     // Initialize variables to store parsed values
  //     let days = null;
  //     let hours = null;
  //     let minutes = null;
  //     let seconds = null;
  //
  //     // Iterate through the components and parse values
  //     for (let i = components.length - 1; i >= 0; i--) {
  //       const part = components[i];
  //       const numericValue = parseFloat(part);
  //
  //       if (!isNaN(numericValue)) {
  //         if (seconds === null) {
  //           seconds = numericValue;
  //         } else if (minutes === null) {
  //           minutes = numericValue;
  //         } else if (hours === null) {
  //           hours = numericValue;
  //         } else if (days === null) {
  //           days = numericValue;
  //         }
  //       }
  //     }
  //
  //     let dayString = `${days} day${days !== 1 ? "s" : ""}`;
  //     let hourString = `${hours} hour${hours !== 1 ? "s" : ""}`;
  //     let minuteString = `${minutes} minute${minutes !== 1 ? "s" : ""}`;
  //     let secondString = `${seconds.toFixed(2)} seconds`;
  //
  //     let formattedDelta = "";
  //     if (days && !isNaN(days)) {
  //       formattedDelta += dayString;
  //     }
  //     if (hours && !isNaN(hours)) {
  //       formattedDelta += `${hourString} `;
  //     }
  //     if (minutes && !isNaN(minutes)) {
  //       formattedDelta += `${minuteString} `;
  //     }
  //     if (seconds && !isNaN(seconds)) {
  //       formattedDelta += `${secondString} `;
  //     }
  //     return formattedDelta;
  //   }
  //   return delta;
  // }

  // const downloadConversation = async () => {
  //   await axios
  //     .post(
  //       process.env.REACT_APP_API_URL +
  //         `/researchers/reported-chatlogs-csv?conversation_id=${convo_id}`
  //     )
  //     .then((res) => {
  //       if (res.headers["content-disposition"]) {
  //         fileDownload(
  //           res.data,
  //           res.headers["content-disposition"].split('"')[1]
  //         );
  //       }
  //     })
  //     .catch((err) => {
  //       setError(err);
  //       // console.log(err);
  //       onErrOpen();
  //     });
  // };


  const fetchPrompt = async (model_id) => {
    await axios.get(process.env.REACT_APP_API_URL + `/models/gpt?model_id=${model_id}`)
        .then((res) => {
          if(res.data){
            setPrompt(res.data.prompt);
          }
        })
        .catch((err) => {
          setError(err);
          // console.log(err);
          onErrOpen();
        });
  }



  useEffect(() => {
    if (convo_id) {
      fetchConversation(convo_id);
    }
  }, [convo_id]);



    return (
        <>
          <Modal
              open={isOpen}
              onClose={onClose}
              disableAutoFocus={true}
          >

            <Box sx={{
              position: 'fixed',
              top: '50%',
              left: '50%',
              zIndex: '100',
              transform: 'translate(-50%, -50%)',
              width: '40%',
              bgcolor: 'background.paper',
              boxShadow: 10,
              pt: 2,
              px: 4,
              pb: 3,
              borderRadius: '8px',
              height: '85vh',
              overflowY: "scroll"
              }}
              className="overflow-y-scroll"
              >
                <span style={{
                  fontWeight: 'bold',
                  fontSize: '20px',
                  color: '#000000',
                  textAlign: 'center',
                  display: 'block',
                }}>
                  Conversation View
                </span>
                <Grid container spacing={2}>
                    <Grid item xs={12} md={9}>

                          <Box className="d-flex my-4 overflow-y-scroll px-4"
                           sx={{ height: "85%" }}
                          >
                            <Table>
                              <Thead style={{ position: 'sticky', top: 0, backgroundColor: '#007bff' }}>
                                <Tr>
                                  <Td className="bg-primary p-2 text-light position-sticky">From</Td>
                                  <Td className="bg-primary p-2 text-light position-sticky">Message</Td>
                                  <Td className="bg-primary p-2 text-light position-sticky">Time</Td>
                                </Tr>
                              </Thead>
                              <Tbody>
                                {convo.map(({ conversation_id, chatlog_id, time, is_user, chatlog }, index) => (
                                  <Tr key={index}>
                                    <Td className="border p-2"> <span style={{ lineHeight: "14px", fontSize: "14px"}}>{is_user ? UTORID : 'Agent'}</span> </Td>
                                    <Td className="border p-2">
                                      {chatlog.split("\n").map((line, index) => (
                                        <p key={index} style={{ lineHeight: "16px", fontSize: "14px"}}>{line}</p>
                                      ))}
                                    </Td>
                                    <Td className="border p-2" style={{ width: "180px"}}> <span style={{ lineHeight: "14px", fontSize: "14px"}}>{time}</span> </Td>
                                  </Tr>
                                ))}
                              </Tbody>
                            </Table>
                        </Box>
                        <Box className="d-flex justify-content-between w-100">
                          <Button className="blue-button" disabled> Download </Button>
                          <Button className="red-button" onClick={onClose}>Close</Button>
                        </Box>

                    </Grid>
                    <Grid item xs={12} md={3}>


                      <span style={{
                      fontWeight: 'bold',
                      fontSize: '20px',
                      color: '#000000',
                      textAlign: 'center',
                      display: 'block',
                      }}>
                        Prompt
                      </span>
                      <TextareaAutosize
                        className="my-2 border"
                        label="Description"
                        placeholder="Model Prompt"
                        diabled
                        value={prompt.length === 0 ? "Modal Prompt Here" : prompt}
                        minRows={3}
                        style={{
                          width: "100%",
                          padding: "16px",
                          overflow: "auto",
                          resize: "none",
                        }}
                      />

                    </Grid>
                </Grid>
              </Box>

            </Modal>
        </>
    );
};

export default AdminConversationView;