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
  return (
    <>
      <Box overflow={"hidden"} ml={"12vw"} mr={"12vw"}>
        <DashboardHeader
          courseCode={courseCode}
          courseName={courseName}
          courses={courses}
          setCurrCourse={setCurrCourse}
          currCourse={currCourse}
          userid={userid}
          setIsLoading={setIsLoading}
          setCourses={setCourses}
        />
        <DashboardBody
          courseID={currCourse.course_id}
          setIsLoading={setIsLoading}
        />
      </Box>
    </>
  );
};

export default Dashboard;
