import {
  Box,
  Button,
  Text,
} from "@chakra-ui/react"
import CourseSelect from "../CourseSelect";
import React from "react";
import UserScopeSelect from "../UserScopeSelect";
import DeploymentSelect from "../DeploymentSelect";

const DashboardHeader = (props) => {
  const {
    courseCode, 
    courseName, 
    currCourse, 
    courses, 
    setCurrCourse,
    setTabIndex,
  } = props;
  // console.log(currCourse)
  // course_code: "CSC311H5"
  // course_id: "b8aaff99-8649-4620-97c0-05272fea47b8"
  // semester: "2022F"
  
  /**
   * Changes the tab number
   * @param {tab number} index [0 - Main analytics; 1 - Course Comparison]
   */
  const handleChangeTab = (index) => {
    setTabIndex(index);
  }
  return (
        <Box mt={3}>
          <Box className="d-flex gap-2 my-2">
            <Box className="blue-button py-1 my-1" onClick={() => handleChangeTab(0)}>Main</Box>
            <Box className="blue-button py-1 my-1" onClick={() => handleChangeTab(1)}>Course Comparison</Box>
          </Box>
          {/* Filter Selectors */}
          <Box className="d-flex flex-col flex-md-row">
            <Box>
              <CourseSelect currCourse={currCourse} courses={courses} setCurrCourse={setCurrCourse} courseName={courseName} inConvo={false}/>
            </Box>
            <Box className="mt-2 mt-md-0 ms-md-2">
              <UserScopeSelect />
            </Box>
            <Box className="mt-2 mt-md-0 ms-md-2">
              <DeploymentSelect courseID={currCourse.course_id} />
            </Box>
          </Box>
          {/* Header */}
          <Box mt={3}>
            <p style={{ color: '#2C54A7', lineHeight:'27px', fontSize: '30px', fontWeight: 700, fontFamily: "Poppins" }} mt={5}>{courseCode}: {courseName}</p>
            <Text size='lg'>Analytics</Text>
          </Box>
        </Box>
    );
}

export default DashboardHeader;