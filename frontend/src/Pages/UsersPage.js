import {
    Box, HStack,
    Text,
    useDisclosure, VStack,
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

const UsersPage = ({ UTORID, auth }) => {
    const [user_id, setUser_id] = useState("");
    const [is_new, setIsNew] = useState(false);
    const [models, setModels] = useState([]);
    const [convoRows, setConvoRows] = useState([]);
    const [convoColumn, setConvoColumn] = useState([]);
    const [unenrolledRows, setUnenrolledRows] = useState([]);
    const [unenrolledColumn, setUnenrolledColumn] = useState([]);
    const [enrolledRows, setEnrolledRows] = useState([]);
    const [enrolledColumn, setEnrolledColumn] = useState([]);
    const {
        isOpen: isErrOpen,
        onOpen: onErrOpen,
        onClose: onErrClose,
    } = useDisclosure();
    const [error, setError] = useState();
    const {isOpen, onOpen, onClose} = useDisclosure();

    const enroll = async (course_id, course_code, semester) => {
        await axios.post(process.env.REACT_APP_API_URL + `/course/enroll?course_id=${course_id}&course_code=${course_code}&utorid=${UTORID}&user_role=${auth}&semester=${semester}`,{})
            .then((res) => {
                if(res.data){
                    console.log("successfully enrolled");
                    fetchUser(UTORID);
                }
            })
            .catch((err) => {
                setError(err);
                onErrOpen();
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
                            {field: 'course_code', width: 150, headerName: 'Course Code'},
                            {field: 'semester', width: 100, headerName: 'Semester'},
                            {field: 'course_name', width: 150, headerName: 'Course Name'},
                            {field: 'start_date', width: 150, headerName: 'Start Date'},
                            {field: 'end_date', width: 150, headerName: 'End Date'},                    
                        ];
                        setUnenrolledColumn(unenrolledColumns);
                    })
                    .catch((err) => {
                        setError(err);
                        onErrOpen();
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
                                    setError(err);
                                    onErrOpen();
                                })
                            let enrolledColumns = [
                                {field: 'id', width: 20, headerName: ""},
                                {field: 'course_code', width: 150, headerName: 'Course Code'},
                                {field: 'semester', width: 100, headerName: 'Semester'},
                                {field: 'course_name', width: 150, headerName: 'Course Name'},
                                {field: 'start_date', width: 150, headerName: 'Start Date'},
                                {field: 'end_date', width: 150, headerName: 'End Date'},
                            ];
                            setEnrolledColumn(enrolledColumns);
                        }
                    })
                    .catch((err) => {
                        setError(err);
                        onErrOpen();
                    });
            })
            .catch((err) => {
                setError(err);
                onErrOpen();
            });
    }


    // Called everytime main course that is selected has changed
    const fetchPastConvos = async (user_id, course_id) => {
        // fetch all models from course id, set names and id
        await axios.get(process.env.REACT_APP_API_URL + `/models/gpt/course?course_id=${course_id}`)
                    .then((res) => {
                        if(res.data){
                            let currModels = res.data.models.reduce((acc, currModel) => {
                                acc[currModel.model_id] = currModel.model_name;
                                return acc;
                            }, {});
                            setModels(currModels);
                        }

                    })
                    .catch((err) => {
                        setError(err);
                        onErrOpen();
                    });
        // fetching all convos in course
        await axios.get(process.env.REACT_APP_API_URL +
            `/student/conversation/history?user_id=${user_id}&course_id=${course_id}&model_ids=${Object.keys(models).join(",")}`)
            .then((res) => {
                if(res.data){
                    setConvoRows(res.data.conversations.map((convo, index) => ({...convo, id: index})));

                    let convoColumns = [
                        {field: 'id', width: 20, headerName: ""},
                        {field: 'conversation_name', width: 100, headerName: 'Conversation Name'},
                        {field: 'model_name', width: 150, headerName: 'Model Name'},
                        {field: 'start_time', width: 150, headerName: 'Start Time'},
                        {field: 'end_time', width: 150, headerName: 'End Time'},
                        {field: 'status', width: 150, headerName: 'Status'},
                    ];
                    setConvoColumn(convoColumns);
                }
            })
            .catch((err) => {
                setError(err);
                onErrOpen();
            });
    }

    const StyledDataGrid = styled(DataGrid)(({ theme }) => ({
    // '& .MuiDataGrid-cell': {
    //   color: green
    // },
    '& .MuiDataGrid-columnHeader': {
        color: "white",
        backgroundColor: '#5D85D4',
        fontFamily: 'Poppins',
        fontWeight: 'bold',
        textTransform: 'uppercase',
        paddingLeft: '16px',
        paddingRight: '16px',
        paddingTop: '4px',
        paddingBottom: '4px',
    },
    '& .MuiDataGrid-row': {
      color: red,
      backgroundColor: 'rgba(255, 0, 0, 0.04)',
      fontFamily: 'Poppins',
    },
    }));

    useEffect(() => {
        if (UTORID.length !== 0) {
            fetchUser(UTORID);
        }
    }, [UTORID]);

    if (!["IS", "AM", "RS"].includes(auth)) {
        return <NotFoundPage/>;
    }

    return UTORID.length !== 0 ? (
        <div style={{
            maxHeight: "50vh",
        }}>
            <TopNav UTORid={UTORID} auth={auth}/>
            <Box ml={"12vw"} mr={"12vw"} pb={"20px"}>
                <Text fontSize='lg'> Interacted with the system: {
                    <Chip
                          style={(!is_new)
                                  ? { backgroundColor: "green", color: "white" }
                                  : { backgroundColor: "#F1F1F1", color: "black" }}
                          label={(!is_new) ? "Yes" : "No"}
                    />
                }</Text>
                <VStack>
                    <VStack p={10}>
                            <Text fontSize='lg'>Unenrolled Courses</Text>
                            {unenrolledRows.length <= 0 ?
                                <Text>No other courses available</Text> : <StyledDataGrid
                                    rows={unenrolledRows}
                                    columns={unenrolledColumn}
                                    onRowClick={(e) => {
                                        enroll(unenrolledRows[e.id].course_id, unenrolledRows[e.id].course_code, unenrolledRows[e.id].semester);
                                    }}
                                />
                            }
                    </VStack>
                    <HStack>
                        <VStack p={10}>
                            <Text fontSize='lg'>Enrolled Courses</Text>
                            {enrolledRows.length <= 0 ?
                                <Text>No other courses available</Text> :
                                <StyledDataGrid
                                    rows={enrolledRows}
                                    columns={enrolledColumn}
                                    onRowClick={(e) => {
                                        fetchPastConvos(user_id, enrolledRows[e.id].course_id);
                                    }}
                                />
                            }
                        </VStack>

                        <VStack p={10}>
                                <Text fontSize='lg'>Conversations</Text>
                                {convoRows.length <= 0 ?
                                    <Text>No conversations in this course</Text> :
                                    <div style={{
                                        height: "40vh",
                                    }}>
                                        <StyledDataGrid
                                            rows={convoRows}
                                            columns={convoColumn}

                                        />
                                    </div>

                                }
                        </VStack>
                    </HStack>
                </VStack>


            </Box>
        </div>
    ) : null;
}

export default UsersPage;