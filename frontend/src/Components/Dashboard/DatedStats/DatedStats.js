import {
    VStack, 
    Flex, 
    Spacer 
} from "@chakra-ui/react";
import StatCard from "./StatCard";
import DatedGraph from "./DatedGraph"

const DatedStats = ({isWeekly}) => {
    return (
        <Flex flexWrap='wrap'>
            <VStack minWidth='320px' w='22vw' spacing='20px'>
                <StatCard title={"Average Rating"} num={4.5} delta={23.36} unit={"☆"}/>
                <StatCard title={"Average Response Rate"} num={10.5} delta={-5.29} unit={"s"}/>
                <StatCard title={"Average Course Comfortability Rating"} num={4.2} delta={10.21} unit={"☆"}/>
                <StatCard title={"Reported Conversations"} num={14} delta={15.29} unit={""}/>
            </VStack>
            <Spacer/>
            <DatedGraph isWeekly={{isWeekly}}/>
        </Flex>
    );
}

export default DatedStats;