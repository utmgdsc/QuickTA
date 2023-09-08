import { Box } from "@chakra-ui/react";
import TopNav from "../Components/TopNav";
import Chat from "../Components/Chat/Chat";
import { useEffect } from "react";

const StudentPage = ({
  currCourse,
  setCurrCourse,
  semester,
  courses,
  isLoading,
  UTORid,
  modelNum = null,
  userId,
}) => {
  // Function used for CSC343 auth in PCRS and Reflections
  // Only be called in student redirects with `model-{x}`
  const setModel = async (model_num) => {
    //   Reflection
    if (model_num === 1) {
      for (let i = 0; i < courses.length; i++) {
        if (courses[i].course_id === "28baadb7-ee0f-42d6-bc57-0f6058656a5a") {
          //   Set 343 reflection course as our current course
          sessionStorage.setItem("selected", `${i}`);
        }
      }
    }
    //  PCRS
    if (model_num === 2) {
      for (let i = 0; i < courses.length; i++) {
        if (courses[i].course_id === "3fc9dc7c-fc3d-4272-9501-7f9ffef52c77") {
          //  Set 343 PCRS course as our current course
          sessionStorage.setItem("selected", `${i}`);
        }
      }
    }

    //  After verification set the current course to this new model
    setCurrCourse({
      course_id:
        courses[parseInt(sessionStorage.getItem("selected"))].course_id,
      course_code:
        courses[parseInt(sessionStorage.getItem("selected"))].course_code,
      semester: courses[parseInt(sessionStorage.getItem("selected"))].semester,
      course_name:
        courses[parseInt(sessionStorage.getItem("selected"))].course_name,
    });
    console.log("SET CALLED ON", model_num);
    console.log(courses);
  };

  useEffect(() => {
    if (Number.isInteger(modelNum) && courses.length > 0) {
      setModel(modelNum);
    }
  }, [courses]);

  return (
    <div
      style={{
        backgroundColor: "#F1F1F1",
        width: "100vw",
        height: "110vh",
      }}
    >
      <TopNav UTORid={UTORid} />
      {courses.length === 0 ? (
        <Box ml={"12vw"} mr={"12vw"}>
          Sorry, you are not enrolled in any courses!
        </Box>
      ) : (
        <Chat
          userId={userId}
          currCourse={currCourse}
          setCurrCourse={setCurrCourse}
          semester={semester}
          courses={courses}
          style={{ position: "relative" }}
        />
      )}
    </div>
  );
};

export default StudentPage;
