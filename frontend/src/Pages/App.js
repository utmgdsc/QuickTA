import "../assets/globals.css";
import { Route } from 'react-router-dom';
import { Routes } from "react-router";
import StudentPage from "./StudentPage";
import ProfessorPage from "./ProfessorPage";
import ResearcherAnalytics from "./ResearcherAnalytics";
import ResearcherModels from "./ResearcherModels";
import {useEffect, useState} from "react";
import axios from "axios";
import CustomSpinner from "../Components/CustomSpinner";


const App = ( { UTORid } ) => {
  const [courses, setCourses] = useState([]);
  const [currCourse, setCurrCourse] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [semester, setSemester] = useState("");

  const getUserId = async () => {
    return await axios.post(process.env.REACT_APP_API_URL + "", {utorid: UTORid})
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

        if(res.data.courses) {
          setCourses(res.data.courses.map((course) => ({course_id: course.course_id,
            course_code: course.course_code})));
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
  }, [UTORid]);

  return isLoading ? <CustomSpinner /> :
    (<div>
        <Routes>
          <Route path="/Student" element={
            <StudentPage 
              UTORid={UTORid} 
              currCourse={currCourse}
              setCurrCourse={setCurrCourse}
              courses={courses} 
              semester={semester}
            />
            } />
          <Route path="/Professor" element={<ProfessorPage/>} />

          <Route path="/ResearcherAnalytics" element={
            <ResearcherAnalytics
              UTORid={UTORid}
              courses={courses}
              setCurrCourse={setCurrCourse}
              currCourse={currCourse}
              courseCode={"CSC311H5"}
              courseName={"Introduction to Machine Learning"}
              semester={semester}
              setIsLoading={setIsLoading}
              isLoading={isLoading}
            />
          } />

          <Route path="/ResearcherModels" element={<ResearcherModels/>} />
        </Routes>
    </div>);
}

export default App;
