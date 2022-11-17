import {
    Box, 
    VStack, 
    Flex, 
    Spacer 
} from "@chakra-ui/react";
import StatCard from "./StatCard";

const DatedStats = ({isWeekly}) => {
    return (
        <Flex flexWrap='wrap'>
            <VStack w='22vw' spacing='15px'>
                <StatCard title={"Average Rating"} num={4.5} delta={23.36} unit={"☆"}/>
                <StatCard title={"Average Response Rate"} num={10.5} delta={-5.29} unit={"s"}/>
                <StatCard title={"Average Course Comfortability Rating"} num={4.2} delta={10.21} unit={"☆"}/>
                <StatCard title={"Reported Question"} num={14} delta={15.29} unit={""}/>
            </VStack>
            <Spacer/>
            <Box w='66vw' h='100px' bg='blue'>
                {/* Graph here */}
            </Box>
        </Flex>
    );
}

export default DatedStats;