import {Box} from "@chakra-ui/react";
import ChatOpenSurvey from "./ChatOpenSurvey";
import ChatBoxTopNav from "./ChatBoxTopNav";
import ChatBox from "./ChatBox";
import ChatBoxFooter from "./ChatBoxFooter";
import {useState} from "react";



const Chat = (props) => {
  const [messages, updateMessages] = useState([]);
  return (
    <>
      <Box bgColor={'white'} overflow={'hidden'} mt={5} border={'1px solid #EAEAEA'} borderTopRadius={'lg'} borderBottomRadius={'lg'} boxShadow={'1px 2px 3px 1px rgba(0,0,0,0.12)'} ml={'12vw'} mr={'12vw'} mb={'30vh'}>
        <ChatOpenSurvey/>
        <ChatBoxTopNav courseCode={props.courseCode}/>
        <ChatBox messages={messages}/>
        <ChatBoxFooter messages={messages} updateMessages={updateMessages}/>
      </Box>
    </>
  );
}


export default Chat;