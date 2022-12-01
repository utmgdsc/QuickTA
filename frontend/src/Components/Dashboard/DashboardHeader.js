import { Box, Heading, Text } from "@chakra-ui/react"
import CourseSelect from "../CourseSelect";

const DashboardHeader = ({courseCode, courseName}) => {
    return (
        <Box mt={4}>
            <CourseSelect/>
            <Heading as='h1' size="lg" color='#2C54A7' lineHeight='0.9' mt={5}>{courseCode}: {courseName}</Heading>
            <Text size='lg'>Admin Dashboard</Text>
        </Box>
    );
}

export default DashboardHeader;