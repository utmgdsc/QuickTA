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
import {
    Chip,
    styled,
    Grid,
    Table,
    TableContainer,
    TableHead,
    TableCell,
    TableBody,
    TableRow, TablePagination
} from "@mui/material";
import {red} from "@mui/material/colors";
import {DataGrid} from "@mui/x-data-grid";

const UsersPage = ({ UTORID, auth }) => {
    const [user_id, setUser_id] = useState("");
    const [is_new, setIsNew] = useState(false);
    const [models, setModels] = useState([]);
    // const [convoRows, setConvoRows] = useState([]);
    // const [convoColumn, setConvoColumn] = useState([]);
    const [studentRows, setStudentRows] = useState([]);
    const [studentColumn, setStudentColumn] = useState([]);
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
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);

    const handleChangePage = (event, newPage) => {
    setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };
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

    const fetchModels = async (course_id) => {
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
    }

    const fetchStudents = async (course_id) => {
        await axios.get(process.env.REACT_APP_API_URL + `/course/users?course_id=${course_id}&user_roles=ST`)
            .then((res) => {
                if(res.data){
                    setStudentRows(res.data.students);

                    let studentCols = [
                        {field: 'id', width: 20, headerName: ""},
                        {field: 'utorid', width: 100, headerName: 'UTORid'},
                        {field: 'role', width: 150, headerName: 'Role'},
                        {field: 'new_user', width: 150, headerName: 'New User'},
                        {field: 'model_name', width: 150, headerName: 'Model name'},
                    ];
                    setStudentColumn(studentCols);
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
        <div
        style={{
            backgroundColor: "#F1F1F1",
            width: "100vw",
            height: "100vh",
            overflowY: "scroll",
        }}
        >
            <TopNav UTORid={UTORID} auth={auth}/>
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
            <Grid container spacing={2}>
                <Grid xs={12} md={6}>
                    <Box>
                        <VStack>
                            <Text fontSize='lg'>Enrolled Courses</Text>
                            {enrolledRows.length <= 0 ?
                                <Text>No other courses available</Text> :
                                <StyledDataGrid
                                    rows={enrolledRows}
                                    columns={enrolledColumn}
                                    onRowClick={(e) => {
                                        fetchModels(enrolledRows[e.id].course_id).then(() => {
                                            fetchStudents(enrolledRows[e.id].course_id);
                                        });
                                    }}
                                />
                            }
                        </VStack>
                    </Box>
               </Grid>
               <Grid xs={12} md={6}>
                   <VStack >
                       <Text fontSize='lg'>Students</Text>
                        <Box className="w-100 h-100 bg-white rounded-2">
                        <TableContainer style={{
                            height: "50vh",
                        }}>
                            <Table>
                                <TableHead  className="border-top">
                                  <TableCell className="reported-conversation-th" style={{ color: "white", fontWeight: 600}}>UTORID</TableCell>
                                  <TableCell className="reported-conversation-th" style={{ color: "white", fontWeight: 600}}>Name</TableCell>
                                  <TableCell className="reported-conversation-th" style={{ color: "white", fontWeight: 600}}>Model Name</TableCell>
                                  <TableCell className="reported-conversation-th" style={{ color: "white", fontWeight: 600, minWidth: "130px"}}>New User</TableCell>
                                  <TableCell className="reported-conversation-th" style={{ color: "white", fontWeight: 600, minWidth: "150px"}}></TableCell>
                                </TableHead>
                                <TableBody>
                                    {studentRows.length === 0 ?
                                    <TableRow className="border-top">
                                      <TableCell colSpan={6} style={{ textAlign: "center" }}>
                                        No Students found.
                                      </TableCell>
                                    </TableRow>
                                : studentRows
                                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                    .map((obj, index) => (
                                    <TableRow key={index} className="border-top" onClick={(e) => {

                                    }}>
                                        <TableCell>{obj.utorid}</TableCell>
                                        <TableCell>{obj.name}</TableCell>
                                        <TableCell>{models[obj.model_id]}</TableCell>
                                        <TableCell
                                        style={{ textAlign: 'center' }}>
                                            <Chip
                                              style={(!obj.new_user)
                                                      ? { backgroundColor: "green", color: "white" }
                                                      : { backgroundColor: "#F1F1F1", color: "black" }}
                                              label={(!obj.new_user) ? "Active" : "Inactive"}
                                            />
                                      </TableCell>
                                    </TableRow>
                                        ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                       <TablePagination
                        rowsPerPageOptions={[10, 25, 100]}
                        component="div"
                        count={studentRows.length}
                        rowsPerPage={rowsPerPage}
                        page={page}
                        onPageChange={handleChangePage}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                       />
                   </Box>
                   </VStack>
               </Grid>
            </Grid>
        </div>
    ) : null;
}

export default UsersPage;