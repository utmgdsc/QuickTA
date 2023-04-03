import { Select, Box } from '@chakra-ui/react';
import {useState} from "react";

const CourseSelect = ({courses, setCurrCourse, wait, currCourse}) => {

    return (
        <Box w='150px'>
            <Select 
            borderColor="white" 
            bg="white"
            boxShadow="1px 2px 3px 1px rgba(0,0,0,0.12)"
            onChange={(e) => {
                setCurrCourse(courses[parseInt(e.target.value)]);
                sessionStorage.setItem('selected', parseInt(e.target.value).toString())
                // Object.keys(courses[parseInt(e.target.value)]).forEach((key) => {sessionStorage.setItem(key, courses[parseInt(e.target.value)][key])});
            }}
            value={parseInt(sessionStorage.getItem('selected'))}
            isDisabled={wait}
            mb={5}
            >
                {courses.map(({id, course_id, semester, course_code}, index) => (<option key={index} value={index}>{course_code}</option>))}
            </Select>
        </Box>
    );
}

export default CourseSelect;