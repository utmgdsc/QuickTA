import { Box, Heading, Text } from "@chakra-ui/react"

const DashboardHeader = ({courseCode, courseName}) => {
    return (
        <Box mt={4}>
            <Heading as='h1' size="lg" color='#2C54A7' lineHeight='0.9'>{courseCode}: {courseName}</Heading>
            <Text size='lg'>Admin Dashboard</Text>
        </Box>
    );
}

export default DashboardHeader;