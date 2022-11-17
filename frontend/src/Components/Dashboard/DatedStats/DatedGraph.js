import {
    Box, 
    Heading
} from "@chakra-ui/react";
import WeeklyGraph from "./WeeklyGraph";
import MonthlyGraph from "./MonthlyGraph";

const DatedGraph = ({isWeekly}) => {
    const cardStyle = {
        backgroundColor: 'white', 
        boxShadow: '1px 2px 3px 1px rgba(0,0,0,0.12)', 
        borderRadius: '15px', 
        padding: '15px 40px 10px 40px',
        width: '50vw',
        marginRight: '1%'
    };

    const titleStyle = {
        fontSize: "20px",
        lineHeight: '25px'
    }

    return (
        
        <Box style={cardStyle}>
            <Heading as='h2'><span style={titleStyle}>Total Interactions</span></Heading>
            {
                (isWeekly) ? (
                    <WeeklyGraph/>
                ) : (
                    <MonthlyGraph/>
                )
            }
        </Box>
    );
}

export default DatedGraph;