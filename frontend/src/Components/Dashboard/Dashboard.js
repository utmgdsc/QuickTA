import DashboardHeader from "./DashboardHeader";
import DashboardBody from "./DashboardBody";
import {Box} from "@chakra-ui/react";

const Dashboard = ({ courseCode, courseName }) => {

    return (
        <>
        <Box overflow={'hidden'} ml={'12vw'} mr={'12vw'}>
            <DashboardHeader courseCode={courseCode} courseName={courseName}/>
            <DashboardBody/>
        </Box>
        </>
    );
}

export default Dashboard;