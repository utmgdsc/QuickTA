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


const App = () => {
  const [courses, setCourses] = useState([]);
  const [currCourse, setCurrCourse] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [userId, setuserId] = useState("");
  const [auth, setAuth] = useState("");
  const [UTORid, setUtorID] = useState("");
  // const [auth, setAuth] = useState("student");
  

  const getUserId = async () => {
    setIsLoading(true);
    const user_id = await axios.post(process.env.REACT_APP_API_URL + "/get-user", {})
      .then((res) => {
        setuserId(res.data.user_id);
        setAuth(res.data.user_role);
        setUtorID(res.data.utorid);
        // console.log(res.data.user_id);
        setIsLoading(false);
        return res.data.user_id
      })
      .catch((e) => {
        console.log(e)
        setIsLoading(false);
      })
      return user_id
  }

  const getAllCourses = async (user_id) => {
    // Gets all the courses a student is enrolled in
    // Pass getUserId return
    await axios.post(process.env.REACT_APP_API_URL + "/user/courses", {user_id: user_id})
      .then((res) => {
        if(res.data.courses) {
          setCourses(res.data.courses.map((course) => ({course_id: course.course_id,
            course_code: course.course_code, semester: course.semester, course_name: course.course_name})));
          
            if (sessionStorage.getItem("selected") === null) {
              sessionStorage.setItem("selected", "0")
            }
            setCurrCourse({course_id: res.data.courses[parseInt(sessionStorage.getItem("selected"))].course_id,
              course_code: res.data.courses[parseInt(sessionStorage.getItem("selected"))].course_code,
              semester: res.data.courses[parseInt(sessionStorage.getItem("selected"))].semester,
              course_name: res.data.courses[parseInt(sessionStorage.getItem("selected"))].course_name});
  
        }
        setIsLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setIsLoading(false);
      })
  }

  useEffect(() => {
      getUserId().then((userid) => {getAllCourses(userid)});
    
  }, []);

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