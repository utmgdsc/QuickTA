import { Select, Box } from '@chakra-ui/react';

const CourseSelect = (courses, currCourse, setCurrCourse) => {
    return (
        <Box w='135px'>
            <Select 
            placeholder={currCourse} 
            borderColor="white" 
            bg="white" 
            boxShadow="1px 2px 3px 1px rgba(0,0,0,0.12)"
            value={currCourse}
            onChange={(e) => {
                
            }}
            >
                {
                    courses.map((c) => {<option value={c}>{c}</option>})
                }
            </Select>
        </Box>
    );
}

export default CourseSelect;