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
  const [tabIndex, setTabIndex] = useState(0);
  return (
    <>
      <Box ml={"5vw"} mr={"5vw"}>
        <DashboardHeader
          courseCode={courseCode}
          courseName={courseName}
          currCourse={currCourse}
          courses={courses}
          setCurrCourse={setCurrCourse}
          setTabIndex={setTabIndex}
        />
        <DashboardBody
          courseID={currCourse.course_id}
          setIsLoading={setIsLoading}
          userScope={userScope}
          setUserScope={setUserScope}
          deploymentFilter={deploymentFilter}
          setDeploymentFilter={setDeploymentFilter}
          tabIndex={tabIndex}
        />
      </Box>
    </>
  );
};

export default Dashboard;
