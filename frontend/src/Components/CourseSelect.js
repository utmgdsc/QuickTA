import { Select, Box } from '@chakra-ui/react';

const CourseSelect = ({currCourse, courses, setCurrCourse, inConvo}) => {
    console.log("courses", courses, currCourse);
    return (
        <Box w='135px'>
            <Select 
            placeholder={currCourse.course_code}
            borderColor="white" 
            bg="white" 
            boxShadow="1px 2px 3px 1px rgba(0,0,0,0.12)"
            value={currCourse.course_code}
            onChange={(e) => {
                setCurrCourse(courses[parseInt(e.target.value)]);
            }}
            isDisabled={inConvo}
            >
                {
                    courses.map(({id, course_id, semester, course_code}, index) => (<option key={index} value={index}>{course_code}</option>))
                }
            </Select>
        </Box>
    );
}

export default CourseSelect;