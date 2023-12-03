import NotFoundPage from "../Components/NotFoundPage";
import * as React from "react";
import TopNav from "../Components/TopNav";
import {
    useEffect, useState
} from "react";
import axios from "axios";
import {
    Grid, Box, Typography, Modal, Button, TextField, TextareaAutosize
} from "@mui/material";
import {DataGrid} from "@mui/x-data-grid";
import AdminConversationView from "../Components/AdminConversationView";
import { Text } from "@chakra-ui/react";
// Working on creating a custom modal for the admin to view the conversation
// add deployment views on each modal and see convos in current course
// implement query pipeline
const UsersPage = ({ UTORID, auth }) => {
    const [open, setOpen] = useState(false);
    const [openQuery, setOpenQuery] = useState(false);
    const [user_id, setUser_id] = useState("");
    const [is_new, setIsNew] = useState(false);
    const [models, setModels] = useState({});
    const [convoRows, setConvoRows] = useState([]);
    const [convoColumn, setConvoColumn] = useState([]);
    const [studentRows, setStudentRows] = useState([]);
    const [studentColumn, setStudentColumn] = useState([]);
    const [unenrolledRows, setUnenrolledRows] = useState([]);
    const [unenrolledColumn, setUnenrolledColumn] = useState([]);
    const [enrolledRows, setEnrolledRows] = useState([]);
    const [enrolledColumn, setEnrolledColumn] = useState([]);
    const [currCourse, setCurrCourse] = useState({});
    const [currUser, setCurrUser] = useState({});
    const [query, setQuery] = useState({
        query: "",
        response: "",
    });
    const [queryRows, setQueryRows] = useState([]);
    const [queryColumn, setQueryColumn] = useState([]);

    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const handleOpenQuery = () => setOpenQuery(true);
    const handleCloseQuery = () => setOpenQuery(false);

    function isEmptyObject(obj) {
        for (var key in obj) {
          if (obj.hasOwnProperty(key)) {
            return false;
          }
        }
        return true;
    }

    function updateField(e) {
        setQuery({
          ...query,
          [e.target.name]: e.target.value,
        });
    }

    const fetchCourseDeployments = async (course_id, course_code, semester) => {
        return axios.get(process.env.REACT_APP_API_URL + `/course/deployment?course_id=${course_id}&course_code=${course_code}&semester=${semester}`)
        .then((res) => {
            if(res.data){
                return res.data.deployments.reduce((acc, currDeployment) => {
                    acc[currDeployment.deployment_id] = currDeployment.deployment_name;
                    return acc;
                }, {});
                
            }
        })
        .catch((err) => {
            console.log(err);
        })
    }


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

                // get enrolled courses
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
                                {field: 'course_name', width: 150, headerName: 'Course Name', flex: 1},
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

    const fetchModels = async (course_id) => {
        return axios.get(process.env.REACT_APP_API_URL + `/models/gpt/course?course_id=${course_id}`)
                    .then((res) => {
                        if(res.data){
                            return res.data.models.reduce((acc, currModel) => {
                                acc[currModel.model_id] = currModel.model_name;
                                return acc;
                            }, {});
                        }
                    })
                    .catch((err) => {
                        console.log(err);
                    });
    }

    const fetchStudents = async (course_id, currDeployments, models) => {
        await axios.get(process.env.REACT_APP_API_URL + `/course/users?course_id=${course_id}&user_roles=ST`)
            .then((res) => {
                if(res.data){
                    let studentRows = res.data.students.map((student, index) => {
                        let deployments = student.status.reduce((acc, currDeployment) => {
                            if(Object.hasOwn(currDeployments, currDeployment.deployment_id)){
                                acc[currDeployments[currDeployment.deployment_id]] = currDeployment.new_user;
                            }
                            return acc;
                        }, {});
                        // console.log(deployments);
                        // console.log(models);
                        let user = {
                            id: index,
                            user_id: student.user_id,
                            utorid: student.utorid,
                            model_name: models[student.model_id],
                            ... deployments,
                        }
                        return user;
                    });
                    // console.log(studentRows);
                    setStudentRows(studentRows);
                    let dCols = Object.values(currDeployments).map((deployment) => ({
                        field: deployment, 
                        width: 350, 
                        headerName: deployment,
                        flex: 1,
                    }));
                    console.log(dCols);
                    let studentCols = [
                        {field: 'id', width: 20, headerName: ""},
                        {field: 'utorid', width: 100, headerName: 'UTORid', flex: 1},
                        // {field: 'role', width: 150, headerName: 'Role', flex: 1},
                        // {field: 'new_user', width: 150, headerName: 'New User', flex: 1},
                        {field: 'model_name', width: 150, headerName: 'Model name', flex: 1},
                        ...dCols,
                    ];
                    // console.log(studentCols);
                    setStudentColumn(studentCols);
                }
            })
            .catch((err) => {
                console.log(err);
            });
    }

    const fetchQuery = async (course_id, user_id, utorid) => {
        axios.get(process.env.REACT_APP_API_URL + `/administrative/course?user_id=${user_id}&utorid=${utorid}&course_id=${course_id}&query=${query.query}`)
        .then((res) => {
            if(res.data){
                console.log(res.data);
                setQueryRows(res.data.map((convo, index) => ({
                    id: index,
                    start_time: convo.start_time.slice(0, 10),
                    end_time: convo.end_time === null ? '' : convo.end_time.slice(0, 10),
                    status: convo.status,
                    reported: convo.reported,
                    comfortability_rating: convo.comfortability_rating,
                    response: convo.conversation_log,
                })));
                let queryColumns = [
                    {field: 'id', width: 20, headerName: ""},
                    {field: 'start_time', width: 150, headerName: 'Start Time', flex: 1},
                    {field: 'end_time', width: 150, headerName: 'End Time', flex: 1},
                    {field: 'status', width: 150, headerName: 'Status', flex: 1},
                    {field: 'reported', width: 150, headerName: 'Reported', flex: 1},
                    {field: 'comfortability_rating', width: 150, headerName: 'Comfortability Rating', flex: 1},
                ];
                setQueryColumn(queryColumns);
            }else{
                alert("No results found");
            }
        })
        .catch((err) => {
            alert(err);
        })
    }

    const style = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '75%',
        height: '85%',
        height: 'auto',
        bgcolor: 'background.paper',
        border: '2px solid #000',
        boxShadow: 24,
        p: 4,
        overflow: 'scroll',
    };

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
            height: "100vh",
            overflowY: "scroll",
        }}
        >
            <TopNav UTORid={UTORID} auth={auth}/>
            <Box overflow={"hidden"} ml={"12vw"} mr={"12vw"} pb={"20px"} textAlign='center'>
            <Typography fontSize='lg' mb={4}>Unenrolled Courses</Typography>
                {unenrolledRows.length <= 0 ?
                    <Typography>No other courses available</Typography> : 
                    <DataGrid
                        rows={unenrolledRows}
                        columns={unenrolledColumn}
                        onRowClick={(e) => {
                            enroll(unenrolledRows[e.id].course_id, unenrolledRows[e.id].course_code, unenrolledRows[e.id].semester);
                            fetchUser(UTORID);
                        }}
                        style={{
                            height: 250
                        }}
                    />
                }
            <Grid container spacing={2}>
                <Grid item xs={6}>
                    <Text fontSize='lg' mb={4} mt={4}>Enrolled Courses</Text>
                    {enrolledRows.length <= 0 ?
                        <Typography>No other courses available</Typography> :
                        <DataGrid
                            rows={enrolledRows}
                            columns={enrolledColumn}
                            onRowClick={(e) => {
                                // console.log(e.row);
                                setCurrCourse(e.row);
                                fetchModels(enrolledRows[e.id].course_id)
                                .then((models) => {
                                    fetchCourseDeployments(enrolledRows[e.id].course_id, enrolledRows[e.id].course_code, enrolledRows[e.id].semester)
                                    .then((deployments) => {
                                        fetchStudents(enrolledRows[e.id].course_id, deployments, models);
                                    });
                                });
                            }}
                            style={{
                                height: 400
                            }}
                        />
                    }
               </Grid>
                <Grid item xs={6}>
                    <Text fontSize='lg' mb={4} mt={4}>Students</Text>
                    {studentRows.length <= 0 ?
                     <Text>No other students available</Text> :
                        <>
                        <DataGrid
                            rows={studentRows}
                            columns={studentColumn}
                            onRowClick={(e) => {
                                console.log(e.row);
                                setCurrUser(e.row);
                                fetchPastConvos(e.row.user_id, currCourse.course_id);
                            }}
                            style={{
                                height: 400
                            }}
                        />
                        </>
                    }
                    
                </Grid>
                {
                    isEmptyObject(currCourse) ? null :
                    <Grid item xs={6}>
                        <Button>Query Course</Button>
                    </Grid>
                }
                { (!isEmptyObject(currCourse) && !isEmptyObject(currUser)) 
                    ?   <Grid item xs={6}>
                            <Button onClick={() => {
                                handleOpen();
                            }}>Query User</Button>
                        </Grid> : null
                    
                }
                <Modal
                 open={open}
                 onClose={() => {
                    setQuery({
                        query: "",
                        response: "",
                    });
                    handleClose();
                }}
                >
                  <Box sx={style} display='flex' flexDirection='row'>
                    <Grid
                      container
                      spacing={2}
                      // direction="row"
                      textAlign='center'
                    >
                      <Grid
                        item
                        xs={12}
                        mb={"1vw"}
                      >
                        <Grid
                          container
                          spacing={2}
                          textAlign='center'
                          direction='column'>

                        <Typography>Query Chatlogs</Typography>
                        <Grid
                         item
                         xs={3}
                         >
                        <TextField
                            name="query"
                            onChange={updateField}
                            value={query.query}
                        ></TextField>
                        <Button onClick={() => {
                            fetchQuery(currCourse.course_id, currUser.user_id, currUser.utorid);
                        }}>Submit</Button>
                         </Grid>
                        
                        </Grid>
                        </Grid>
                      {queryRows.length <= 0 ? null :
                      <>
                        <Grid
                            item
                            xs={12}
                            mb={"1vw"}
                        >
                            <Typography>Query Results</Typography>
                            <DataGrid
                                rows={queryRows}
                                columns={queryColumn}
                                style={{
                                    height: 400
                                }}
                                onRowClick={(e) => {
                                    console.log(e.row);
                                    setQuery({
                                        ...query,
                                        response: e.row.response,
                                    });
                                }}
                            />
                        </Grid>
                        {query.response.length <= 0 
                        ? null 
                        : 
                        <TextareaAutosize
                        className="my-2 border"
                        label="Description"
                        placeholder="Chatlog"
                        diabled
                        value={query.response.length === 0 ? "empty chatlog" : query.response}
                        minRows={3}
                        style={{
                        width: "100%",
                        padding: "16px",
                        overflow: "auto",
                        resize: "none",
                        height: "100%"
                        }}                    
                        />
                        }
                        </>
                    }

                    </Grid>
                  </Box>
                </Modal>
            </Grid>
            </Box>
        </div>
    ) : null;
}

export default UsersPage;