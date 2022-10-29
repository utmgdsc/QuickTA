import {Box, VStack} from "@chakra-ui/react";
import ChatOpenSurvey from "./ChatOpenSurvey";
import ChatBoxTopNav from "./ChatBoxTopNav";
import ChatBox from "./ChatBox";
import ChatBoxFooter from "./ChatBoxFooter";



const Chat = (props) => {
  return (
    <Box bgColor={'white'} overflow={'hidden'} mt={5} borderTopRadius={'lg'} borderBottomRadius={'lg'} ml={'10vw'} mr={'10vw'} mb={'30vh'}>
      <ChatOpenSurvey/>
      <ChatBoxTopNav courseCode={props.courseCode}/>
      <ChatBox/>
      <ChatBoxFooter/>
    </Box>
  );
}


export default Chat;