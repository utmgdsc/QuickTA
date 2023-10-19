import {
  Box,
  Text,
} from "@chakra-ui/react"
import CourseSelect from "../CourseSelect";
import React from "react";
import UserScopeSelect from "../UserScopeSelect";

const DashboardHeader = ({courseCode, courseName, currCourse, courses, setCurrCourse, userid, setCourses, setIsLoading, userScope, setUserScope}) => {
  // console.log(currCourse)
  // course_code: "CSC311H5"
  // course_id: "b8aaff99-8649-4620-97c0-05272fea47b8"
  // semester: "2022F"
  return (
        <Box mt={3}>
          <Box className="d-flex">
            <CourseSelect currCourse={currCourse} courses={courses} setCurrCourse={setCurrCourse} courseName={courseName} inConvo={false}/>
            <Box ml={3}>
              <UserScopeSelect userScope={userScope} setUserScope={setUserScope} />
            </Box>
          </Box>
          <Box mt={3}>
            <p style={{ color: '#2C54A7', lineHeight:'27px', fontSize: '30px', fontWeight: 700, fontFamily: "Poppins" }} mt={5}>{courseCode}: {courseName}</p>
            <Text size='lg'>Analytics</Text>
          </Box>
        </Box>
    );
}

export default DashboardHeader;