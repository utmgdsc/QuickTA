import {Box, Heading, Text} from "@chakra-ui/react";
import { Stack, Spacer} from "@chakra-ui/react";
import StatCard from "./StatCard";

const DatedStats = ({isWeekly}) => {
    return (
        <Stack spacing={2} direction='row'>
            <Box w='20%'>
                <StatCard title={"Average Rating"} num={4.5} delta={23.36} unit={"☆"}/>
                <Spacer/>
                <StatCard title={"Average Response Rate"} num={10.5} delta={-5.29} unit={"s"}/>
                <Spacer/>
                <StatCard title={"Average Course Comfortability Rating"} num={4.2} delta={10.21} unit={"☆"}/>
                <Spacer/>
                <StatCard title={"Reported Question"} num={14} delta={15.29} unit={""}/>
            </Box>
            <Box w='60%' h='100px' bg='blue'>2</Box>
        </Stack>
    );
}

export default DatedStats;