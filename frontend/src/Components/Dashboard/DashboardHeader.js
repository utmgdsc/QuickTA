import {Box, Heading, Text} from "@chakra-ui/react"

const DashboardHeader = ({courseCode, courseName}) => {
    return (
        <Box mt={4}>
            <Heading as='h1' size="lg" style={{color: "#012E8A", lineHeight: "0.9"}}>{courseCode}: {courseName}</Heading>
            <Text style={{fontSize: "lg"}}>Admin Dashboard</Text>
        </Box>
    );
}

export default DashboardHeader;