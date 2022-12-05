import {
    Button,
    Modal,
    ModalBody, ModalCloseButton,
    ModalContent, ModalFooter,
    ModalHeader,
    ModalOverlay,
    Table, Tbody,
    Td,
    Thead, Tr
} from "@chakra-ui/react";
import axios from "axios";
import {useEffect, useState} from "react";
import CustomSpinner from "../../CustomSpinner";

const ConversationView = ({isOpen, onClose, convo_id}) => {
    const [convo, setConvo] = useState([]);
    const fileDownload = require('js-file-download');

    const fetchConversation = async (conversation_id) => {
        await axios.post(process.env.REACT_APP_API_URL + "/researcher/report-chatlogs", {conversation_id: convo_id})
        .then((res) => {setConvo(res.data.conversations)})
        .catch((err) => console.log(err))
    }
    
    useEffect(() => {
        if(convo_id){
            fetchConversation(convo_id);
        }
    }, [convo_id]);

    return( 
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
                          .catch((err) => console.log(err))
                    }}>Download</Button>
                    <ModalCloseButton>Close</ModalCloseButton>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
}


export default ConversationView;