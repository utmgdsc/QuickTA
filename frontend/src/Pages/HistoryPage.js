import {
    Box,
    Text,
    useDisclosure,
} from "@chakra-ui/react";
import NotFoundPage from "../Components/NotFoundPage";
import * as React from "react";
import TopNav from "../Components/TopNav";
import {
    useEffect, useState
} from "react";
import axios from "axios";
import { Chip, } from "@mui/material";
import {styled} from "@mui/material/styles";
import {DataGrid} from "@mui/x-data-grid";
import {red} from "@mui/material/colors";
import { Grid } from "@mui/material"
import AdminConversationView from "../Components/AdminConversationView";



const HistoryPage = ({ UTORID, auth }) => {
    const [isLoading, setIsLoading] = useState(true);
    const [user_id, setUser_id] = useState("");
    const [is_new, setIsNew] = useState(false);
    const [convoRows, setConvoRows] = useState([]);
    const [convoColumn, setConvoColumn] = useState([]);
    const [unenrolledRows, setUnenrolledRows] = useState([]);
    const [unenrolledColumn, setUnenrolledColumn] = useState([]);
    const [enrolledRows, setEnrolledRows] = useState([]);
    const [enrolledColumn, setEnrolledColumn] = useState([]);
    const {isOpen, onOpen, onClose} = useDisclosure();
    const [rowIndex, setRowIndex] = useState(0);

    const enroll = async (course_id, course_code, semester) => {
        await axios.post(process.env.REACT_APP_API_URL + `/course/enroll?course_id=${course_id}&course_code=${course_code}&utorid=${UTORID}&user_role=${auth}&semester=${semester}`,{})
            .then((res) => {
                if(res.data){
                    console.log("successfully enrolled");
                    fetchUser(UTORID);
                }
            })
            .catch((err) => {
                console.log(err);
            })
    };
    const fetchUser = async (UTORID) => {
        await axios.get(process.env.REACT_APP_API_URL + `/user?utorid=${UTORID}`)
            .then((res) => {
                setUser_id(res.data.user_id);
                setIsNew(res.data.new_user);
                // get unenrolled courses
                axios.get(process.env.REACT_APP_API_URL + `/user/unenrolled-courses?utorid=${UTORID}`)
                    .then((res) => {
                        setUnenrolledRows(res.data.map((course, index) => ({
                            id: index,
                            course_code: course.course_code,
                            course_id: course.course_id,
                            course_name: course.course_name,
                            semester: course.semester,
                            start_date: course.start_date.substring(0, 10),
                            end_date: course.end_date.substring(0, 10),
                        })));
                        let unenrolledColumns = [
                            {field: 'id', width: 20, headerName: ""},
                            {field: 'course_code', width: 150, headerName: 'Course Code', flex: 1},
                            {field: 'semester', width: 100, headerName: 'Semester', flex: 1},
                            {field: 'course_name', width: 150, headerName: 'Course Name', flex: 1},
                            {field: 'start_date', width: 150, headerName: 'Start Date', flex: 1},
                            {field: 'end_date', width: 150, headerName: 'End Date', flex: 1},                    
                        ];
                        setUnenrolledColumn(unenrolledColumns);
                    })
                    .catch((err) => {
                        console.log(err);
                    });

                axios.get(process.env.REACT_APP_API_URL + `/user/courses?utorid=${UTORID}`)
                    .then((res) => {
                        if(res.data){

                            let enrolledString = res.data.join(",");
                            axios.get(process.env.REACT_APP_API_URL + `/course/list?course_ids=${enrolledString}`)
                                .then((res) => {
                                    if(res.data){
                                     let data = res.data;
                                     setEnrolledRows(data.courses.map((course, index) => ({
                                        id: index,
                                        course_code: course.course_code,
                                        course_id: course.course_id,
                                        course_name: course.course_name,
                                        semester: course.semester,
                                        start_date: course.start_date.substring(0, 10),
                                        end_date: course.end_date.substring(0, 10),
                                     })))
                                    }

                                })
                                .catch((err) => {
                                    console.log(err);
                                })
                            let enrolledColumns = [
                                {field: 'id', width: 20, headerName: ""},
                                {field: 'course_code', width: 150, headerName: 'Course Code', flex: 1},
                                {field: 'semester', width: 100, headerName: 'Semester', flex: 1},
                                {field: 'course_name', width: 150, headerName: 'Course Name',  flex: 1},
                                {field: 'start_date', width: 150, headerName: 'Start Date', flex: 1},
                                {field: 'end_date', width: 150, headerName: 'End Date', flex: 1},
                            ];
                            setEnrolledColumn(enrolledColumns);
                        }
                    })
                    .catch((err) => {
                        console.log(err);
                    });
            })
            .catch((err) => {
                console.log(err);
            });
    }


    // Called everytime main course that is selected has changed
    const fetchPastConvos = async (user_id, course_id) => {
        // fetch all models from course id, set names and id
        let lookup = await axios.get(process.env.REACT_APP_API_URL + `/models/gpt/course?course_id=${course_id}`)
                    .then((res) => {
                        if(res.data){
                            let currModels = res.data.models.reduce((acc, currModel) => {
                                acc[currModel.model_id] = currModel.model_name;
                                return acc;
                            }, {});
                            return currModels;
                        }

                    })
                    .catch((err) => {
                        console.log(err);
                    });
        // fetching all convos in course
        await axios.get(process.env.REACT_APP_API_URL +
            `/student/conversation/history?user_id=${user_id}&course_id=${course_id}&model_ids=${Object.keys(lookup).join(",")}`)
            .then((res) => {
                if(res.data){
                    setConvoRows(res.data.conversations.map((convo, index) => ({
                        id: index,
                        conversation_id: convo.conversation_id,
                        conversation_name: convo.conversation_name,
                        model_name: lookup[convo.model_id],
                        model_id: convo.model_id,
                        start_time: convo.start_time,
                        end_time: convo.end_time === null ? '' : convo.end_time,
                        status: convo.status,
                    })));
                    let convoColumns = [
                        // {field: 'id', width: 20, headerName: ""},
                        {field: 'conversation_name', width: 250, headerName: 'Conversation Name', flex: 1},
                        {field: 'model_name', width: 300, headerName: 'Model Name', flex: 1},
                        {field: 'start_time', width: 150, headerName: 'Start Time', flex: 1},
                        {field: 'end_time', width: 150, headerName: 'End Time', flex: 1},
                        {field: 'status', width: 150, headerName: 'Status', flex: 1},
                    ];
                    setConvoColumn(convoColumns);
                }
            })
            .catch((err) => {
                console.log(err);
            });
    }

    useEffect(() => {
        if (UTORID.length !== 0) {
            fetchUser(UTORID);
        }
    }, [UTORID]);

    if (!["IS", "AM", "RS"].includes(auth)) {
        return <NotFoundPage/>;
    }

    return UTORID.length !== 0 ? (
    <div 
    style={{
        backgroundColor: "#F1F1F1",
        width: "100vw",
        maxHeight: "100vh",
        minHeight: "100vh",
    }}        
        >
        <TopNav UTORid={UTORID} auth={auth}/>
        <Box overflow={"hidden"} ml={"12vw"} mr={"12vw"} pb={"20px"} textAlign='center'>
        {/* <Text fontSize='lg' mb={4}> Interacted with the system: {
            <Chip
                    style={(!is_new)
                            ? { backgroundColor: "green", color: "white" }
                            : { backgroundColor: "#F1F1F1", color: "black" }}
                    label={(!is_new) ? "Yes" : "No"}
            />
        }</Text> */}
        <Text fontSize='lg' mb={4}>Unenrolled Courses</Text>
        {unenrolledRows.length <= 0 ?
            <Text>No other courses available</Text> : 
            <DataGrid
                rows={unenrolledRows}
                columns={unenrolledColumn}
                onRowClick={(e) => {
                    enroll(unenrolledRows[e.id].course_id, unenrolledRows[e.id].course_code, unenrolledRows[e.id].semester);
                }}
            />
        }        
        <Grid container spacing={2}>
            <Grid item xs={6}>
                <Text fontSize='lg' mb={4} mt={4}>Enrolled Courses</Text>
                {enrolledRows.length <= 0 ?
                    <Text>No other courses available</Text> :
                    <div style={{
                        height: "40vh"
                    }}>
                        <DataGrid
                            rows={enrolledRows}
                            columns={enrolledColumn}
                            onRowClick={(e) => {
                                fetchPastConvos(user_id, enrolledRows[e.id].course_id);
                            }}
                            style={{
                                height: 400
                            }}
                        />
                    </div>

                }
            </Grid>
            <Grid item xs={6}>
                <Text fontSize='lg' mb={4} mt={4}>Conversations</Text>
                {convoRows.length <= 0 ?
                    <Text>No conversations in this course</Text> :
                    <>
                        <DataGrid
                            rows={convoRows}
                            columns={convoColumn}
                            onRowClick={(e) => {
                                // console.log(convoRows[e.row.id].conversation_id)
                                setRowIndex(e.row.id);
                                onOpen();
                            }}
                            style={{
                                height: 400
                            }}
                        />
                        <AdminConversationView
                            convo_id={convoRows[rowIndex].conversation_id}
                            isOpen={isOpen}
                            onClose={onClose}
                            UTORID={UTORID}
                            model_id={convoRows[rowIndex].model_id}
                        />
                    </>

                }
            </Grid>
        </Grid>
        </Box>
    </div>
    ) : null;
}

export default HistoryPage;
