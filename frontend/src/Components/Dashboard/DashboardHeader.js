import {
  Box,
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
    userid, 
    setCourses, 
    setIsLoading, 
    userScope, 
    setUserScope, 
    deploymentFilter,
    setDeploymentFilter,
  } = props;
  // console.log(currCourse)
  // course_code: "CSC311H5"
  // course_id: "b8aaff99-8649-4620-97c0-05272fea47b8"
  // semester: "2022F"
  return (
        <Box mt={3}>
          {/* Filter Selectors */}
          <Box className="d-flex flex-col flex-sm-row">
            <Box>
              <CourseSelect currCourse={currCourse} courses={courses} setCurrCourse={setCurrCourse} courseName={courseName} inConvo={false}/>
            </Box>
            <Box className="mt-2 mt-sm-0 ms-sm-2">
              <UserScopeSelect userScope={userScope} setUserScope={setUserScope} />
            </Box>
            <Box className="mt-2 mt-sm-0 ms-sm-2">
              <DeploymentSelect courseID={currCourse.course_id} deploymentFilter={deploymentFilter} setDeploymentFilter={setDeploymentFilter}/>
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