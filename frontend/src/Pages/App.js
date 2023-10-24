import "../assets/globals.css";
import { Route } from "react-router-dom";
import { Routes } from "react-router";
import StudentPage from "./StudentPage";
import ResearcherAnalytics from "./ResearcherAnalytics";
import ResearcherModels from "./ResearcherModels";
import React, { useEffect, useState, useContext, createContext } from "react";
import axios from "axios";
import LandingPage from "./LandingPage";
import NotFoundPage from "../Components/NotFoundPage";
// import AdminPage from "./AdminPage";
import { useDisclosure } from "@chakra-ui/react";
import ErrorDrawer from "../Components/ErrorDrawer";
import SettingPage from "./SettingPage";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import CoursesPage from "./CoursesPage";
import UsersPage from "./UsersPage";
// import { red } from "@mui/material/colors";


const App = () => {
  const [courses, setCourses] = useState([]);
  const [currCourse, setCurrCourse] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [userId, setuserId] = useState("");
  const [model_id, setModelId] = useState("");
  const [auth, setAuth] = useState("");
  const [UTORid, setUtorID] = useState("choiman3");
  const [isNewUser, setIsNewUser] = useState(true);
  // const [courseName, setCourseName] = useState("");
  const {
    isOpen: isErrOpen,
    onOpen: onErrOpen,
    onClose: onErrClose,
  } = useDisclosure();
  const [error, setError] = useState();

  const getUserId = async () => {
    setIsLoading(true);
    const user = await axios
      .get(process.env.REACT_APP_API_URL + `/user?utorid=${UTORid}`)
      .then(async (res) => {
        // User authentication
        let data = res.data;
        setIsNewUser(data.new_user);
        setuserId(data.user_id);
        setUtorID(data.utorid);
        await getAllCourses(data.courses);

        setAuth(res.data.user_role);
        if (res.data.user_role === "ST") { setModelId(data.model_id); }
        
        // Check if user is new
        return res.data.user_id;
      })
      .catch((err) => {
        setError(err);
        console.log(err);
        onErrOpen();
      });

    return user;
  };

  /**
   * Loads all the courses a student is enrolled in
   * @param {List of String} courses List of Course IDs 
   */
  const getAllCourses = async (courses) => {
    let params = "course_ids=" + courses.join(",");
    await axios
      .get(process.env.REACT_APP_API_URL + `/course/list?${params}`)
      .then((res) => {
        if (res.data.courses) {
          setCourses(
            res.data.courses.map((course) => ({
              course_id: course.course_id,
              course_code: course.course_code,
              semester: course.semester,
              course_name: course.course_name,
            }))
          );

          if (sessionStorage.getItem("selected") === null) {
            sessionStorage.setItem("selected", "0");
          }
          setCurrCourse({
            course_id:
              res.data.courses[parseInt(sessionStorage.getItem("selected"))]
                .course_id,
            course_code:
              res.data.courses[parseInt(sessionStorage.getItem("selected"))]
                .course_code,
            semester:
              res.data.courses[parseInt(sessionStorage.getItem("selected"))]
                .semester,
            course_name:
              res.data.courses[parseInt(sessionStorage.getItem("selected"))]
                .course_name,
          });
        }
        setTimeout(() => { setIsLoading(false); }, 2000);
      })
      .catch((err) => {
        setError(err);
        console.log(err)
        onErrOpen();

        setTimeout(() => { setIsLoading(false); }, 2000);
      });
  };

  useEffect(() => {
    if (UTORid) { getUserId(); }
  }, [UTORid]);

  const MuiTheme = createTheme({
    typography: {
      fontFamily: 'Poppins'
    }
  });
  

  return <ThemeProvider theme={MuiTheme}>
    {(isLoading ? (
      <LandingPage isLoading={isLoading} />
    ) : (
      <>
        <Routes>
          <Route
            path="/"
            element={
              isNewUser ? (
                <LandingPage
                  isLoading={isLoading}
                  UTORid={UTORid}
                  isNewUser={isNewUser}
                  setIsNewUser={setIsNewUser}
                />
              ) : (
                <StudentPage
                  UTORid={UTORid}
                  auth={auth}
                  currCourse={currCourse}
                  setCurrCourse={setCurrCourse}
                  courses={courses}
                  semester={currCourse.semester}
                  userId={userId}
                  model_id={model_id}
                />
              )
            }
          />
          <Route
            path="/analytics"
            element={
              <ResearcherAnalytics
                userid={userId}
                UTORid={UTORid}
                auth={auth}
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
            }
          />

          <Route
            path="/models"
            element={
              <ResearcherModels
                UTORid={UTORid}
                auth={auth}
                courses={courses}
                setCurrCourse={setCurrCourse}
                currCourse={currCourse}
                courseCode={currCourse.course_code}
                courseName={currCourse.course_name}
                semester={currCourse.semester}
              />
            }
          />
          {/* TO BE FIXED */}
          {/* <Route
            path="/filters"
            element={<ResearcherFilterPage UTORid={UTORid} auth={auth} />}
          /> */}
          <Route
            path="/settings"
            element={<SettingPage UTORID={UTORid} auth={auth} />}
          />
          <Route
            path="/courses"
            element={<CoursesPage UTORID={UTORid} auth={auth}/>}
          />
          <Route
            path="/users"
            element={<UsersPage UTORID={UTORid} auth={auth}/>}
          />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
        <ErrorDrawer error={error} isOpen={isErrOpen} onClose={onErrClose} />
      </>
    ))}
  </ThemeProvider>
};

export default App;
