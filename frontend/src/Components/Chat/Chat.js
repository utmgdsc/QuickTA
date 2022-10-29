import {Box, VStack} from "@chakra-ui/react";
import ChatBoxTopNav from "./ChatBoxTopNav";
import ChatBox from "./ChatBox";
import ChatBoxFooter from "./ChatBoxFooter";
import {useState} from "react";



const Chat = (props) => {
  const [messages, updateMessages] = useState([]);
  return (
    <Box bgColor={'white'} overflow={'hidden'} mt={5} borderTopRadius={'lg'} borderBottomRadius={'lg'} ml={'10vw'} mr={'10vw'} mb={'30vh'}>
      <ChatBoxTopNav courseCode={props.courseCode}/>
      <ChatBox messages={messages}/>
      <ChatBoxFooter messages={messages} updateMessages={updateMessages}/>
    </Box>
  );
}


export default Chat;