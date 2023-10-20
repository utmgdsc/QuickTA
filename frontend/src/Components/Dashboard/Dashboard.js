import { useState } from "react";
import DashboardHeader from "./DashboardHeader";
import DashboardBody from "./DashboardBody";
import { Box } from "@chakra-ui/react";

const Dashboard = ({
  courseCode,
  courseName,
  courses,
  setCurrCourse,
  currCourse,
  setIsLoading,
  userid,
  setCourses,
}) => {
  const [userScope, setUserScope] = useState([]); 
  const [deploymentFilter, setDeploymentFilter] = useState([]);
  return (
    <>
      <Box ml={"5vw"} mr={"5vw"}>
        <DashboardHeader
          courseCode={courseCode}
          courseName={courseName}
          courses={courses}
          setCurrCourse={setCurrCourse}
          currCourse={currCourse}
          userid={userid}
          setIsLoading={setIsLoading}
          setCourses={setCourses}
          userScope={userScope}
          setUserScope={setUserScope}
          deploymentFilter={deploymentFilter}
          setDeploymentFilter={setDeploymentFilter}
        />
        <DashboardBody
          courseID={currCourse.course_id}
          setIsLoading={setIsLoading}
          userScope={userScope}
          setUserScope={setUserScope}
        />
      </Box>
    </>
  );
};

export default Dashboard;
