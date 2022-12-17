import DashboardHeader from "./DashboardHeader";
import DashboardBody from "./DashboardBody";
import {Box} from "@chakra-ui/react";
import axios from "axios";
import {useEffect, useState} from "react";

const Dashboard = ({ courseCode, courseName, courses, setCurrCourse, currCourse, setIsLoading, userid}) => {

    return (
        <>
        <Box overflow={'hidden'} ml={'12vw'} mr={'12vw'}>
            <DashboardHeader
              courseCode={courseCode}
              courseName={courseName}
              courses={courses}
              setCurrCourse={setCurrCourse}
              currCourse={currCourse}/>
            <DashboardBody courseID={currCourse.course_id} setIsLoading={setIsLoading}/>
        </Box>
        </>
    );
}

export default Dashboard;