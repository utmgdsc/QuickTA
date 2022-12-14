import { Select, Box } from '@chakra-ui/react';

const CourseSelect = ({currCourse, courses, setCurrCourse, wait}) => {
    

    return (
        <Box w='135px' mb={3}>
            <Select 
            borderColor="white" 
            bg="white"
            boxShadow="1px 2px 3px 1px rgba(0,0,0,0.12)"
            onChange={(e) => {
                setCurrCourse(courses[parseInt(e.target.value)]);
            }}
            isDisabled={wait}
            >
                {courses.map(({id, course_id, semester, course_code}, index) => (<option key={index} value={index}>{course_code}</option>))}
            </Select>
        </Box>
    );
}

export default CourseSelect;