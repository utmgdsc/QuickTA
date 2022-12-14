import {Box, useRadio} from "@chakra-ui/react";
import ChatOpenSurvey from "./ChatOpenSurvey";
import ChatBoxTopNav from "./ChatBoxTopNav";
import ChatBox from "./ChatBox";
import ChatBoxFooter from "./ChatBoxFooter";
import {useState, useEffect} from "react";
import axios from "axios";
import CourseSelect from "../CourseSelect";



const Chat = ({ currCourse , semester, courses, setCurrCourse}) => {
  
  const [messages, updateMessages] = useState([]);
  const [inConvo, updateInConvo] = useState(false);
  const [currConvoID, updateConvoID] = useState("");

  return (
    <>
      <Box ml={'12vw'} mr={'12vw'}>
        <CourseSelect courses={courses} currCourse={currCourse} setCurrCourse={setCurrCourse} wait={inConvo}/>
        <Box as={"div"} bgColor={'white'} overflow={'hidden'} mt={5} border={'1px solid #EAEAEA'} borderTopRadius={'lg'} borderBottomRadius={'lg'} boxShadow={'1px 2px 3px 1px rgba(0,0,0,0.12)'} mb={'30vh'}>
          <ChatOpenSurvey/>
          <ChatBoxTopNav courseCode={currCourse.course_code} currConvoID={currConvoID}/>
          <ChatBox messages={messages}/>
          <ChatBoxFooter
          updateMessages={updateMessages}
          inConvo={inConvo} 
          updateInConvo={updateInConvo}
          currConvoID={currConvoID}
          updateConvoID={updateConvoID}
          course_ID={currCourse.course_id}
          messages={messages}
          />
        </Box>
      </Box>
    </>
  );
}


export default Chat;