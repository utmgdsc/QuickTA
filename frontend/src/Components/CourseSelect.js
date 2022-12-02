import { Select, Box } from '@chakra-ui/react';

const CourseSelect = () => {
    return (
        <Box w='135px'>
            <Select placeholder='CSC311H5' borderColor="white" bg="white" boxShadow="1px 2px 3px 1px rgba(0,0,0,0.12)">
                <option value='option1'>CSC108H5</option>
                <option value='option2'>CSC148H5</option>
                <option value='option3'>CSC207H5</option>
            </Select>
        </Box>
    );
}

export default CourseSelect;