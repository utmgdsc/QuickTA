import DashboardHeader from "./DashboardHeader";
import DashboardBody from "./DashboardBody";
import {Box} from "@chakra-ui/react";
import axios from "axios";
import {useEffect, useState} from "react";

const Dashboard = ({ courseCode, courseName, semester }) => {
    const [course_id, setCourseID] = useState("");
    useEffect(() => {
        fetchCourseID();
    }, [courseCode, semester]);

    const fetchCourseID = async () => {
        return axios.post(process.env.REACT_APP_API_URL + "/get-course", {course_code: courseCode, semester: semester})
          .then((res) => {
              setCourseID(res.data.course_id);
          })
          .catch((err) => console.log(err))
    }

    return (
        <>
        <Box overflow={'hidden'} ml={'12vw'} mr={'12vw'}>
            <DashboardHeader courseCode={courseCode} courseName={courseName}/>
            <DashboardBody courseID={course_id}/>
        </Box>
        </>
    );
}

export default Dashboard;