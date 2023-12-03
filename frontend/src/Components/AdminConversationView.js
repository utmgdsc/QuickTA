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

// Downloads the conversation history as a CSV file.
const handleDownloadConversation = () => {
    if (convo_id) {
      axios.post(
          process.env.REACT_APP_API_URL + `/student/conversation/history/csv?conversation_id=${convo_id}`,
          { conversation_id: convo_id }
        )
        .then((response) => {
            console.log(convo_id);
          if (response.headers["content-disposition"]) {
            fileDownload(response.data, response.headers["content-disposition"].split('"')[1]);
          }
        })
    } 
}

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
                width: '85%',
                bgcolor: 'background.paper',
                boxShadow: 10,
                pt: 2,
                px: 4,
                pb: 3,
                borderRadius: '8px',
                height: '85vh',
                // overflowY: "scroll"
            }}
            // className="overflow-y-scroll"
            >
                <Grid container spacing={2}>
                    <Grid item xs={8}>
                        <span style={{
                        fontWeight: 'bold',
                        fontSize: '20px',
                        color: '#000000',
                        textAlign: 'center',
                        display: 'block',
                        }}>
                        Conversation View
                        </span>
                        <Box className="d-flex my-4 overflow-y-scroll px-4"
                            sx={{ height: "65vh" }}
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
                    </Grid>
                    <Grid item xs={4}>


                    <span style={{
                    fontWeight: 'bold',
                    fontSize: '20px',
                    color: '#000000',
                    textAlign: 'center',
                    display: 'block',
                    }}>
                        Prompt
                    </span>
                    <Box
                        sx={{ height: "90%", marginY: 2, px: "4" }}    
                    >
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
                            height: "100%"
                            }}
                        />
                    </Box>
                    </Grid>
                    <Grid item xs={12}>
                        <Box className="d-flex justify-content-between w-100">
                            <Button className="blue-button" onClick={handleDownloadConversation}> Download </Button>
                            <Button className="red-button" onClick={onClose}>Close</Button>
                        </Box>                        
                    </Grid>
                </Grid>
            </Box>

            </Modal>
        </>
    );
};

export default AdminConversationView;