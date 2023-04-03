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
import AdminPage from "./AdminPage";


const App = ( {UTORid = ""} ) => {
  const [courses, setCourses] = useState([]);
  const [currCourse, setCurrCourse] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [userId, setuserId] = useState("");
  const [courseName, setCourseName] = useState("");
  const [auth, setAuth] = useState("");
  // const [auth, setAuth] = useState("student");
  

  const getUserId = async () => {
    const user_id = await axios.post(process.env.REACT_APP_API_URL + "/get-user", {utorid: UTORid})
      .then((res) => {
        setuserId(res.data.user_id);
        setAuth(res.data.user_role);
        // console.log(res.data.user_id);
        return res.data.user_id
      })
      .catch((e) => {console.log(e)})
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

  // Function used for CSC343 auth in PCRS and Reflections
  // Only be called in student redirects with `model-{x}`
  const setModel = async (model_num) => {
    //   Reflection
    if(model_num === 1){
      for (let i = 0; i < courses.length; i++) {
        if(courses[i].course_id ==="33399325-f39e-4130-aabc-8c67469d2717"){
        //   Set 343 reflection course as our current course
          sessionStorage.setItem("selected", `${i}`);
        }
      }
    }
    //  PCRS
    if (model_num === 2){
      for(let i = 0; i < courses.length; i++){
        if(courses[i].course_id === "2f801ccd-3fc2-41b9-821b-75898d856f03"){
          //  Set 343 PCRS course as our current course
          sessionStorage.setItem("selected", `${i}`);
        }
      }
    }

    //  After verification set the current course to this new model
    setCurrCourse({course_id: res.data.courses[parseInt(sessionStorage.getItem("selected"))].course_id,
      course_code: res.data.courses[parseInt(sessionStorage.getItem("selected"))].course_code,
      semester: res.data.courses[parseInt(sessionStorage.getItem("selected"))].semester,
      course_name: res.data.courses[parseInt(sessionStorage.getItem("selected"))].course_name});

  }

  useEffect(() => {
    if(UTORid){
      getUserId().then((userid) => {getAllCourses(userid)});
      console.log(auth);
    }
  }, [UTORid]);

  return isLoading ? <CustomSpinner /> :
    (<>
        <Routes>
          {auth === "ST" ? <React.Fragment>
            <Route path="/" element={
              <StudentPage
                UTORid={UTORid}
                currCourse={currCourse}
                setCurrCourse={setCurrCourse}
                courses={courses}
                semester={currCourse.semester}
              />
            } />
            <Route path={"/model-1"}>
              <StudentPage
                UTORid={UTORid}
                currCourse={currCourse}
                setCurrCourse={setCurrCourse}
                courses={courses}
                semester={currCourse.semester}
                setModelFunc={setModel}
                modelNum={1}
              />
            </Route>
            <Route path={"/model-2"}>
              <StudentPage
                UTORid={UTORid}
                currCourse={currCourse}
                setCurrCourse={setCurrCourse}
                courses={courses}
                semester={currCourse.semester}
                setModelFunc={setModel}
                modelNum={2}
              />
            </Route>
          </React.Fragment> : null}
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
          { auth === "AD" ? <React.Fragment>
              <Route path="/" element={<AdminPage UTORID={UTORid}/>} />
            </React.Fragment>
            : null
          }
          
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
    </>);
}

export default App;