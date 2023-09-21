import {
    Button,
    Modal,
    ModalBody, ModalCloseButton,
    ModalContent, ModalFooter,
    ModalHeader,
    ModalOverlay,
    Table, Tbody,
    Td,
    Thead, Tr, useDisclosure
} from "@chakra-ui/react";
import axios from "axios";
import React, {useEffect, useState} from "react";
import CustomSpinner from "../../CustomSpinner";
import ErrorDrawer from "../../ErrorDrawer";

const ConversationView = ({isOpen, onClose, convo_id}) => {
    const [convo, setConvo] = useState([]);
    const fileDownload = require('js-file-download');
    const {isOpen: isErrOpen, onOpen: onErrOpen, onClose: onErrClose} = useDisclosure();
    const [error, setError] = useState();
    const fetchConversation = async (conversation_id) => {
        await axios.get(process.env.REACT_APP_API_URL + `/researchers/report-chatlogs?conversation_id=${convo_id}`)
        .then((res) => {setConvo(res.data.conversations)})
        .catch((err) => {
            setError(err);
            onErrOpen();
        })
    }
    
    useEffect(() => {
        if(convo_id){
            fetchConversation(convo_id);
        }
    }, [convo_id]);

    return(
        <>
        <Modal isOpen={isOpen} onClose={onClose} scrollBehavior={"inside"}>
            <ModalOverlay/>
            <ModalContent>
                <ModalHeader style={{
                    fontFamily: "Poppins"
                }}>Conversation View
                </ModalHeader>
                <ModalBody>
                    <Table>
                        <Thead>
                            <Tr>
                                <Td>From</Td>
                                <Td>Message</Td>
                                <Td>Time</Td>
                                <Td>Delta</Td>
                            </Tr>
                        </Thead>
                        <Tbody>
                            {convo.map(({speaker, chatlog, time, delta}, index) => (
                                <Tr key={index}>
                                    <Td>{speaker}</Td>
                                    <Td>{chatlog}</Td>
                                    <Td>{time}</Td>
                                    <Td>{delta}</Td>
                                </Tr>
                            ))}
                        </Tbody>
                    </Table>
                </ModalBody>
                <ModalFooter>
                    <Button onClick={async () => {
                        await axios.post(process.env.REACT_APP_API_URL + "/researcher/reported-chatlogs-csv",
                          {conversation_id: convo_id})
                          .then((res) => {
                              if(res.headers['content-disposition']){
                                  fileDownload(res.data, res.headers['content-disposition'].split('"')[1]);
                              }
                          })
                          .catch((err) => {
                            setError(err);
                            onErrOpen();
                          })
                    }}>Download</Button>
                    <ModalCloseButton>Close</ModalCloseButton>
                </ModalFooter>
            </ModalContent>
        </Modal>
        <ErrorDrawer error={error} isOpen={isErrOpen} onClose={onErrClose}/>
    </>
    );
}


export default ConversationView;