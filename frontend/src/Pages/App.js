import "../assets/globals.css";
import { Route, useNavigate } from 'react-router-dom';
import { Routes } from "react-router";
import StudentPage from "./StudentPage";
import ProfessorPage from "./ProfessorPage";
import ResearcherAnalytics from "./ResearcherAnalytics";
import ResearcherModels from "./ResearcherModels";
import ResearcherFilterPage from "./ResearcherFilterPage";
import React, {useEffect, useState} from "react";
import axios from "axios";
import CustomSpinner from "../Components/CustomSpinner";
import NotFoundPage from '../Components/NotFoundPage'


const App = ( {UTORid = "testuser1"} ) => {
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [currCourse, setCurrCourse] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [semester, setSemester] = useState("");
  const [userId, setuserId] = useState("");
  const [courseName, setCourseName] = useState("");
  const [auth, setAuth] = useState("professor");
  

  const getUserId = async () => {
    return await axios.post(process.env.REACT_APP_API_URL + "/get-user", {utorid: UTORid})
      .then((res) => {
        return setuserId(res.data.user_id);
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
            course_code: course.course_code, semester: course.semester, course_name: course.course_name})));
          
          setCurrCourse({course_id: res.data.courses[0].course_id,
            course_code: res.data.courses[0].course_code, semester: res.data.courses[0].semester});
          
          setSemester(res.data.courses[0].semester);
        }
        setIsLoading(false);
      })
      .catch((err) => console.log(err))
  }

  useEffect(() => {
    if(UTORid){
      getAllCourses();
      getUserId();

      // TODO: Set up auth here 
      // if (auth === "student") navigate("/Student")
      // if (auth === "professor") navigate("/ResearcherModels")
      
    }
  }, [UTORid]);

  return isLoading ? <CustomSpinner /> :
    (<div>
        <Routes>
          { auth === "student" ? <Route path="/" element={
            <StudentPage 
              UTORid={UTORid} 
              currCourse={currCourse}
              setCurrCourse={setCurrCourse}
              courses={courses} 
              semester={semester}
            />
            } /> : null}
            { auth === "professor" ? <React.Fragment>
              <Route path="/Professor" element={<ProfessorPage/>} />

              <Route path="/ResearcherAnalytics" element={
                <ResearcherAnalytics
                  UTORid={UTORid}
                  courses={courses}
                  setCurrCourse={setCurrCourse}
                  currCourse={currCourse}
                  courseCode={currCourse.course_code}
                  courseName={currCourse.course_name}
                  semester={semester}
                  setIsLoading={setIsLoading}
                  isLoading={isLoading}
                />
              } />
    
              <Route path="/" element={
              <ResearcherModels 
              UTORid={"testuser1"}
              courses={courses}
              setCurrCourse={setCurrCourse}
              currCourse={currCourse}
              courseCode={currCourse.course_code}
              courseName={currCourse.course_name}
              semester={semester}
              />
              }/>
              <Route path="/ResearcherFilters" element={<ResearcherFilterPage/>} />
              </React.Fragment>
              : null
            }
          
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
    </div>);
}

export default App;
