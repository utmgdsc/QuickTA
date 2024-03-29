import {
  Box,
  Heading,
  Text,
  HStack,
  Button,
  ModalHeader,
} from "@chakra-ui/react";
import TopNav from "../Components/TopNav";
import ModelHeader from "../Components/ModelManager/ModelHeader";
import ModelBody from "../Components/ModelManager/ModelBody";
import CustomSpinner from "../Components/CustomSpinner";
import CourseSelect from "../Components/CourseSelect";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import NotFoundPage from "../Components/NotFoundPage";

const ResearcherModels = ({
  UTORid,
  auth,
  currCourse,
  setCurrCourse,
  courses,
}) => {
  const [loadingModel, setLoadingModel] = useState(false);

  if (!["IS", "AM", "RS"].includes(auth)) {
    return <NotFoundPage />;
  }

  return Object.keys(currCourse).length === 0 &&
    currCourse.constructor === Object ? (
    <CustomSpinner />
  ) : (
    <div
      style={{
        backgroundColor: "#F1F1F1",
        width: "100vw",
        height: "100vh",
        overflowY: "scroll",
      }}
    >
      <TopNav UTORid={UTORid} auth={auth} />
      <Box ml={"12vw"} mr={"12vw"}>
        <CourseSelect
          currCourse={currCourse}
          courses={courses}
          setCurrCourse={setCurrCourse}
          wait={loadingModel}
        />
        <ModelHeader
          courseCode={currCourse.course_code}
          courseName={currCourse.course_name}
        />
        <ModelBody
          courseid={currCourse.course_id}
          setLoadingModel={setLoadingModel}
          loadingModel={loadingModel}
        />
        {/*<Link to={"/ResearcherFilters"}>*/}
        {/*  <Button my={5} mx={2} colorScheme={"blue"}>*/}
        {/*    Redirect to Filters*/}
        {/*  </Button>*/}
        {/*</Link>*/}
        {/*<Link to={"/ResearcherAnalytics"}>*/}
        {/*  <Button my={5} mx={2} colorScheme={"blue"}>*/}
        {/*    Redirect to Analytics*/}
        {/*  </Button>*/}
        {/*</Link>*/}
      </Box>
    </div>
  );
};

export default ResearcherModels;
