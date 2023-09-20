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
  // Function used for CSC343 auth in PCRS and Reflections
  // Only be called in student redirects with `model-{x}`
  // const setModel = async (model_num) => {
  //   //   Reflection
  //   if (model_num === 1) {
  //     for (let i = 0; i < courses.length; i++) {
  //       if (courses[i].course_id === "28baadb7-ee0f-42d6-bc57-0f6058656a5a") {
  //         //   Set 343 reflection course as our current course
  //         sessionStorage.setItem("selected", `${i}`);
  //       }
  //     }
  //   }
  //   //  PCRS
  //   if (model_num === 2) {
  //     for (let i = 0; i < courses.length; i++) {
  //       if (courses[i].course_id === "3fc9dc7c-fc3d-4272-9501-7f9ffef52c77") {
  //         //  Set 343 PCRS course as our current course
  //         sessionStorage.setItem("selected", `${i}`);
  //       }
  //     }
  //   }

  //   //  After verification set the current course to this new model
  //   setCurrCourse({
  //     course_id:
  //       courses[parseInt(sessionStorage.getItem("selected"))].course_id,
  //     course_code:
  //       courses[parseInt(sessionStorage.getItem("selected"))].course_code,
  //     semester: courses[parseInt(sessionStorage.getItem("selected"))].semester,
  //     course_name:
  //       courses[parseInt(sessionStorage.getItem("selected"))].course_name,
  //   });
  //   console.log("SET CALLED ON", model_num);
  //   console.log(courses);
  // };

  const [models, setModels] = useState([]);
  const [currModel, setCurrModel] = useState({});

  const getModels = async (course) => {
    let params = "course_id=" + course.course_id;
    axios
      .get(process.env.REACT_APP_API_URL + `/course/models?${params}`)
      .then((res) => {
        let data = res.data;
        console.log(data);
        if(data.models){
          setModels(data.models);

          if(sessionStorage.getItem("selectedModel") == null){
            sessionStorage.setItem("selectedModel", "0");
          }
          
          let model = data.models[parseInt(sessionStorage.getItem("selectedModel"))]

          setCurrModel({
            model_id: model.course_id,
            model_name: model.model_name,
            course_id: model.course_id,
            status: model.status
          });

        }else{
          console.log("No models for this course!")
        }
        
      });
  };

  useEffect(() => {
    if(courses){
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
