import {Box, useRadio} from "@chakra-ui/react";
import ChatOpenSurvey from "./ChatOpenSurvey";
import ChatBoxTopNav from "./ChatBoxTopNav";
import ChatBox from "./ChatBox";
import ChatBoxFooter from "./ChatBoxFooter";
import {useState} from "react";
import axios from "axios";
import CourseSelect from "../CourseSelect";



const Chat = ({ courseCode, semester }) => {
  const [messages, updateMessages] = useState([]);
  const [inConvo, updateInConvo] = useState(false);
  const [currConvoID, updateConvoID] = useState("");
  const [courseID, setCourseID] = useState("");

  const fetchCourseID = async () => {
    return axios.post(process.env.REACT_APP_API_URL + "/get-course", {course_code: courseCode, semester: semester})
      .then((res) => {
        setCourseID(res.data.course_id);
      })
      .catch((err) => console.log(err))
  }
  
  if((courseCode && semester)){
    fetchCourseID();
  }

  return (
    <>
      <Box ml={'12vw'} mr={'12vw'}>
        <CourseSelect/>
        <Box as={"div"} bgColor={'white'} overflow={'hidden'} mt={5} border={'1px solid #EAEAEA'} borderTopRadius={'lg'} borderBottomRadius={'lg'} boxShadow={'1px 2px 3px 1px rgba(0,0,0,0.12)'} mb={'30vh'}>
          <ChatOpenSurvey/>
          <ChatBoxTopNav courseCode={courseCode} currConvoID={currConvoID}/>
          <ChatBox messages={messages}/>
          <ChatBoxFooter
          updateMessages={updateMessages}
          inConvo={inConvo} 
          updateInConvo={updateInConvo}
          currConvoID={currConvoID}
          updateConvoID={updateConvoID}
          course_ID={courseID}
          messages={messages}
          />
        </Box>
      </Box>
    </>
  );
}


export default Chat;