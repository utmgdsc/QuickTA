import {Box, useRadio} from "@chakra-ui/react";
import ChatBoxTopNav from "./ChatBoxTopNav";
import ChatBox from "./ChatBox";
import ChatBoxFooter from "./ChatBoxFooter";
import {useState, useEffect} from "react";
import CourseSelect from "../CourseSelect";



const Chat = ({ currCourse, courses, setCurrCourse, userId}) => {
  const [messages, updateMessages] = useState([]);
  const [inConvo, updateInConvo] = useState(false);
  const [currConvoID, updateConvoID] = useState("");
  const [waitingForResp, setWaitForResp] = useState(false);

  return (
    <>
      <Box ml={'12vw'} mr={'12vw'}>
        <CourseSelect courses={courses} currCourse={currCourse} setCurrCourse={setCurrCourse} wait={inConvo}/>
        <Box as={"div"} bgColor={'white'} overflow={'hidden'} mt={5} border={'1px solid #EAEAEA'} borderTopRadius={'lg'} borderBottomRadius={'lg'} boxShadow={'1px 2px 3px 1px rgba(0,0,0,0.12)'} mb={'30vh'}>
          <ChatBoxTopNav courseCode={currCourse.course_code} currConvoID={currConvoID}/>
          <ChatBox messages={messages} waitingForResp={waitingForResp}/>
          <ChatBoxFooter
          userId={userId}
          updateMessages={updateMessages}
          inConvo={inConvo}
          updateInConvo={updateInConvo}
          currConvoID={currConvoID}
          updateConvoID={updateConvoID}
          course_ID={currCourse.course_id}
          messages={messages}
          waitingForResp={waitingForResp}
          setWaitForResp={setWaitForResp}
          />
        </Box>
      </Box>
    </>
  );
}


export default Chat;