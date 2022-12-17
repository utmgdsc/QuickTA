import {
  Box,
  Heading,
  Text,
  HStack,
  Button, Spacer
} from "@chakra-ui/react"
import CourseSelect from "../CourseSelect";
import CourseCreator from "./CourseCreator";
import React from "react";
import {Link} from 'react-router-dom';

const DashboardHeader = ({courseCode, courseName, currCourse, courses, setCurrCourse}) => {
    return (
        <Box mt={4}>
            <HStack>
                <CourseSelect currCourse={currCourse} courses={courses} setCurrCourse={setCurrCourse} courseName={courseName} inConvo={false}/>
                <HStack spacing={3}>
                  <Link to={"/"}>
                    <Button colorScheme={"blue"} style={{backgroundColor: '#2C54A7', color: 'white'}}>To Models Page</Button>
                  </Link>
                  <Link to={"/ResearcherFilters"}>
                    <Button colorScheme={"blue"} style={{backgroundColor: '#2C54A7', color: 'white'}}>To Filters Page</Button>
                  </Link>
                </HStack>
                <Spacer/>
                <CourseCreator/>
            </HStack>
            <Heading as='h1' size="lg" color='#2C54A7' lineHeight='0.9' mt={5}>{courseCode}: {courseName}</Heading>
            <Text size='lg'>Admin Dashboard</Text>
        </Box>
    );
}

export default DashboardHeader;