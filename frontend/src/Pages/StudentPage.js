import {
  Box,
  Drawer,
  DrawerBody, DrawerCloseButton,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  Modal, ModalBody, ModalCloseButton, ModalContent, ModalHeader, ModalOverlay,
  useDisclosure
} from "@chakra-ui/react";
import TopNav from "../Components/TopNav";
import Chat from "../Components/Chat/Chat";
import React, { useEffect } from "react";
import axios from "axios";
import { useState } from "react";
import ErrorDrawer from "../Components/ErrorDrawer";

const StudentPage = ({
  currCourse,
  setCurrCourse,
  semester,
  courses,
  isLoading,
  UTORid,
  auth,
  modelNum = null,
  userId,
}) => {
  const [models, setModels] = useState([]);
  const [currModel, setCurrModel] = useState({});
  const [waitingForResp, setWaitForResp] = useState(false);
  const {isOpen: isErrOpen, onOpen: onErrOpen, onClose: onErrClose} = useDisclosure();
  const [error, setError] = useState();
  const getModels = async (course) => {
    let params = "course_id=" + course.course_id;
    axios
      .get(process.env.REACT_APP_API_URL + `/course/models?${params}`)
      .then((res) => {
        let data = res.data;
        setWaitForResp(true);
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
        setWaitForResp(false);
      }).catch((err) => {
        setError(err);
        onErrOpen();
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
        minHeight: "100vh",
      }}
    >
      <TopNav UTORid={UTORid} auth={auth} />
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
          waitingForResp={waitingForResp}
          setWaitForResp={setWaitForResp}
          style={{ position: "relative" }}
        />
      )}
      <ErrorDrawer error={error} isOpen={isErrOpen} onClose={onErrClose}/>
    </div>
  );
};

export default StudentPage;
