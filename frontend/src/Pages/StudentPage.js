import { Box } from "@chakra-ui/react";
import TopNav from "../Components/TopNav";
import Chat from "../Components/Chat/Chat";
import { useEffect } from "react";
import axios from "axios";
import { useState } from "react";

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
  const [models, setModels] = useState([]);
  const [currModel, setCurrModel] = useState({});

  const getModels = async (course) => {
    let params = "course_id=" + course.course_id;
    axios
      .get(process.env.REACT_APP_API_URL + `/course/models?${params}`)
      .then((res) => {
        let data = res.data;

        if (data.models) {
          setModels(data.models);

          if (sessionStorage.getItem("selectedModel") == null) {
            sessionStorage.setItem("selectedModel", "0");
          }

          setCurrModel(
            data.models[parseInt(sessionStorage.getItem("selectedModel"))]
          );
        } else {
          console.log("No models for this course!");
        }
      });
  };

  useEffect(() => {
    if (courses) {
      getModels(currCourse);
    }
  }, [currCourse]);

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
          currModel={currModel}
          setCurrModel={setCurrModel}
          semester={semester}
          courses={courses}
          models={models}
          style={{ position: "relative" }}
        />
      )}
    </div>
  );
};

export default StudentPage;
