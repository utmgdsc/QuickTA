import {Box, useRadio} from "@chakra-ui/react";
import ChatOpenSurvey from "./ChatOpenSurvey";
import ChatBoxTopNav from "./ChatBoxTopNav";
import ChatBox from "./ChatBox";
import ChatBoxFooter from "./ChatBoxFooter";
import {useState} from "react";
import axios from "axios";



const Chat = ({ courseCode, semester }) => {
  const [messages, updateMessages] = useState([]);
  const [inConvo, updateIsConvo] = useState(false);
  const [currConvoID, updateConvoID] = useState("");

  const fetchCourseID = () => {
    axios.post().then(() => {}).catch((err) => console.log(err))
  }
  return (

      <Box as={"div"} bgColor={'white'} overflow={'hidden'} mt={5} border={'1px solid #EAEAEA'} borderTopRadius={'lg'} borderBottomRadius={'lg'} boxShadow={'1px 2px 3px 1px rgba(0,0,0,0.12)'} ml={'12vw'} mr={'12vw'} mb={'30vh'}>
        <ChatOpenSurvey/>
        <ChatBoxTopNav courseCode={fetchCourseID()} currConvoID={currConvoID}/>
        <ChatBox messages={messages}/>
        <ChatBoxFooter 
        messages={messages}
        updateMessages={updateMessages}
        inConvo={inConvo} 
        updateIsConvo={updateIsConvo}
        currConvoID={currConvoID}
        updateConvoID={updateConvoID}
        />
      </Box>

  );
}


export default Chat;