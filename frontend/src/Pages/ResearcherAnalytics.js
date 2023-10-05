import TopNav from "../Components/TopNav";
import Dashboard from "../Components/Dashboard/Dashboard";
import { Spinner } from "@chakra-ui/react";
import React from "react";
import NotFoundPage from "../Components/NotFoundPage";

const ResearcherAnalytics = ({
  UTORid,
  auth,
  courseCode,
  courseName,
  semester,
  currCourse,
  setCurrCourse,
  courses,
  isLoading,
  setIsLoading,
  userid,
  setCourses,
}) => {
  if (!["IS", "AM", "RS"].includes(auth)) {
    return <NotFoundPage />;
  }

  return isLoading ? (
    <Spinner />
  ) : (
    <div
      style={{
        backgroundColor: "#F1F1F1",
        width: "100vw",
        height: "auto",
      }}
    >
      <TopNav UTORid={UTORid} auth={auth} />
      <Dashboard
        userid={userid}
        courseCode={courseCode}
        semester={semester}
        courseName={courseName}
        style={{ position: "relative" }}
        currCourse={currCourse}
        setCurrCourse={setCurrCourse}
        courses={courses}
        setIsLoading={setIsLoading}
        setCourses={setCourses}
      />
      
    </div>
  );
};

export default ResearcherAnalytics;
