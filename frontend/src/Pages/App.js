import "../assets/globals.css";
import { Route } from "react-router-dom";
import { Routes } from "react-router";
import StudentPage from "./StudentPage";
import ProfessorPage from "./ProfessorPage";
import ResearcherAnalytics from "./ResearcherAnalytics";
import ResearcherModels from "./ResearcherModels";
import ResearcherFilterPage from "./ResearcherFilterPage";
import React, { useEffect, useState } from "react";
import axios from "axios";
import CustomSpinner from "../Components/CustomSpinner";
import NotFoundPage from "../Components/NotFoundPage";
import AdminPage from "./AdminPage";

const App = ({ UTORid = "" }) => {
  const [courses, setCourses] = useState([]);
  const [currCourse, setCurrCourse] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [userId, setuserId] = useState("");
  const [courseName, setCourseName] = useState("");
  const [auth, setAuth] = useState("");
  // const [auth, setAuth] = useState("student");

  const getUserId = async () => {
    setIsLoading(true);
    const user = await axios
      .get(process.env.REACT_APP_API_URL + `/user?utorid=${UTORid}`)
      .then(async (res) => {
        // User authentication
        let data = res.data;
        setuserId(data.user_id);
        let courses = await getAllCourses(data.courses);
        setAuth(res.data.user_role);

        setIsLoading(false);
        return res.data.user_id;
      })
      .catch((e) => {
        console.log(e);
        setIsLoading(false);
      });

    return user;
  };

  const getAllCourses = async (courses) => {
    // Gets all the courses a student is enrolled in
    // Pass getUserId return
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
        setIsLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setIsLoading(false);
      });
  };

  useEffect(() => {
    if (UTORid) {
      getUserId();
    }
  }, [UTORid]);

  return isLoading ? (
    <CustomSpinner />
  ) : (
    <>
      <Routes>
        {auth === "ST" ? (
          <React.Fragment>
            <Route
              path="/"
              element={
                <StudentPage
                  UTORid={UTORid}
                  currCourse={currCourse}
                  setCurrCourse={setCurrCourse}
                  courses={courses}
                  semester={currCourse.semester}
                  userId={userId}
                />
              }
            />
          </React.Fragment>
        ) : null}
        {auth === "IS" ? (
          <React.Fragment>
            <Route path="/Professor" element={<ProfessorPage />} />
            <Route
              path="/ResearcherAnalytics"
              element={
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
              }
            />

            <Route
              path="/"
              element={
                <ResearcherModels
                  UTORid={UTORid}
                  courses={courses}
                  setCurrCourse={setCurrCourse}
                  currCourse={currCourse}
                  courseCode={currCourse.course_code}
                  courseName={currCourse.course_name}
                  semester={currCourse.semester}
                />
              }
            />
            <Route
              path="/ResearcherFilters"
              element={<ResearcherFilterPage UTORid={UTORid} />}
            />
          </React.Fragment>
        ) : null}
        {auth === "AM" ? (
          <React.Fragment>
            <Route path="/" element={<AdminPage UTORID={UTORid} />} />
            <Route
              path="/ResearcherAnalytics"
              element={
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
              }
            />
          </React.Fragment>
        ) : null}

        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </>
  );
};

export default App;
