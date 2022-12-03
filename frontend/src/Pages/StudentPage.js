import {Box} from "@chakra-ui/react";
import TopNav from "../Components/TopNav";
import Chat from "../Components/Chat/Chat";
import {useState, useEffect} from "react";
import axios from 'axios';
import CustomSpinner from '../Components/CustomSpinner';
import dataToCourseParser from "../utls/dateToCourseParser";
import dateToCourseParser from "../utls/dateToCourseParser";

const StudentPage = ({UTORid}) => {
  const [courses, setCourses] = useState([]);
  const [currCourse, setCurrCourse] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [semester, setSemester] = useState("");

  const getUserId = async () => {
    return await axios.post(process.env.REACT_APP_API_URL + "", {utorid: ""})
    .then((res) => {
      return res._
    })
    .catch((e) => {console.log(e)})
  }

  const getAllCourses = async () => {
    // Gets all the courses a student is enrolled in
    // Pass getUserId return
    return axios.post(process.env.REACT_APP_API_URL + "/user/courses", {user_id: "76d1c94d-48c2-4b7a-9ec9-1390732d84a0"})
      .then((res) => {
        console.log(res.data.courses);

        if(res.data.courses) {
          setCourses(res.data.courses.map((course) => ({course_id: course.course_id, course_code: course.course_code})));
          setCurrCourse(res.data.courses[0]);
          setSemester(res.data.courses[0].semester);
        }
        setIsLoading(false);
      })
      .catch((err) => console.log(err))
  }

  useEffect(() => {
    if(UTORid){
      getAllCourses();
    }
  }, [UTORid])

    return isLoading ? <CustomSpinner /> : (
    <div style={{
        backgroundColor: "#F1F1F1",
        width: "100vw",
        height: '110vh'
      }}>
        <TopNav UTORid={"UTORid"}/>
        {
          currCourse ? <Chat currCourse={currCourse} setCurrCourse={setCurrCourse} semester={semester} courses={courses} style={{position: 'relative'}}/>
          : <Box ml={'12vw'} mr={'12vw'}>Sorry, you are not enrolled in any courses! </Box>
        }
        
    </div>
    );
};


export default StudentPage;