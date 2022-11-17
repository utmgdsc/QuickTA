import DashboardHeader from "./DashboardHeader";
import DashboardBody from "./DashboardBody";
import {Box} from "@chakra-ui/react";

const Dashboard = (props) => {

    return (
        <>
        <Box overflow={'hidden'} ml={'12vw'} mr={'12vw'}>
            <DashboardHeader courseCode={props.courseCode} courseName={props.courseName}/>
            <DashboardBody/>
        </Box>
        </>
    );
}

export default Dashboard;