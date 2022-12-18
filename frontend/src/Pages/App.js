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


const App = ( {UTORid = ""} ) => {
  const [courses, setCourses] = useState([]);
  const [currCourse, setCurrCourse] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [userId, setuserId] = useState("");
  const [courseName, setCourseName] = useState("");
  const [auth, setAuth] = useState("");
  // const [auth, setAuth] = useState("student");
  

  const getUserId = async () => {
    await axios.post(process.env.REACT_APP_API_URL + "/get-user", {utorid: UTORid})
      .then((res) => {
        setuserId(res.data.user_id);
        setAuth(res.data.user_role);
      })
      .catch((e) => {console.log(e)})
  }

  const getAllCourses = async () => {
    // Gets all the courses a student is enrolled in
    // Pass getUserId return
    await axios.post(process.env.REACT_APP_API_URL + "/user/courses", {user_id: "76d1c94d-48c2-4b7a-9ec9-1390732d84a0"})
      .then((res) => {
        if(res.data.courses) {
          setCourses(res.data.courses.map((course) => ({course_id: course.course_id,
            course_code: course.course_code, semester: course.semester, course_name: course.course_name})));
          
          setCurrCourse({course_id: res.data.courses[0].course_id,
            course_code: res.data.courses[0].course_code, semester: res.data.courses[0].semester});

        }
        setIsLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setIsLoading(false);
      })
  }

  useEffect(() => {
    if(UTORid){
      getAllCourses();
      getUserId();
      
    }
  }, [UTORid]);

  return isLoading ? <CustomSpinner /> :
    (<div>
        <Routes>
          { auth === "ST" ? <Route path="/" element={
            <StudentPage
              UTORid={UTORid} 
              currCourse={currCourse}
              setCurrCourse={setCurrCourse}
              courses={courses} 
              semester={currCourse.semester}
            />
            } /> : null}
            { auth === "IS" ? <React.Fragment>
              <Route path="/Professor" element={<ProfessorPage/>} />

              <Route path="/ResearcherAnalytics" element={
                <ResearcherAnalytics
                  userid={userId}
                  UTORid={UTORid}
                  courses={courses}
                  setCurrCourse={setCurrCourse}
                  currCourse={currCourse}
                  courseCode={currCourse.course_code}
                  courseName={currCourse.course_name}
                  semester={currCourse.semester}
                  setIsLoading={setIsLoading}
                  isLoading={isLoading}
                  setCourses={setCourses}
                />
              } />
    
              <Route path="/" element={
              <ResearcherModels 
              UTORid={UTORid}
              courses={courses}
              setCurrCourse={setCurrCourse}
              currCourse={currCourse}
              courseCode={currCourse.course_code}
              courseName={currCourse.course_name}
              semester={currCourse.semester}
              />
              }/>
              <Route path="/ResearcherFilters" element={<ResearcherFilterPage UTORid={UTORid}/>} />
              </React.Fragment>
              : null
            }
          
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
    </div>);
}

export default App;