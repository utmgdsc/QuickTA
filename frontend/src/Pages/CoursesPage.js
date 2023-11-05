
import {useEffect, useState} from "react";
import NotFoundPage from "../Components/NotFoundPage";
import axios from "axios";
import TopNav from "../Components/TopNav";
import * as React from "react";
import { DataGrid } from "@mui/x-data-grid";
import { styled } from "@mui/material/styles";
import { Grid, CircularProgress, Button, Modal, Box, Tooltip, Typography, TextField, } from "@mui/material";


const CoursesPage = ({ UTORID, auth }) => {
// const {
//     isOpen: isErrOpen,
//     onOpen: onErrOpen,
//     onClose: onErrClose,
// } = useDisclosure();
// const [error, setError] = useState();
const [isLoading, setIsLoading] = useState(true);
const [courseRows, setCourseRows] = useState([]);
const [courseColumn, setCourseColumn] = useState([]);
const [studentRows, setStudentRows] = useState([]);
const [studentColumn, setStudentColumn] = useState([]);
const [instructorRows, setInstructorRows] = useState([]);
const [instructColumn, setInstructorColumn] = useState([]);
const [open, setOpen] = useState(false);
const [openEdit, setOpenEdit] = useState(false);
const [unenrolledRows, setUnenrolledRows] = useState([]);
const [unenrolledColumn, setUnenrolledColumn] = useState([]);
const [selectedUsers, setSelectedUsers] = useState(new Set());
const [currCourse, setCurrCourse] = useState({});
const [editPage, setEditPage] = useState({
  course_code: "",
  semester: "",
  course_name: "",
  start_date: "",
  end_date: ""
});
const handleOpen = () => setOpen(true);
const handleClose = () => setOpen(false);

const handleEditOpen = () => setOpenEdit(true);
const handleEditClose = () => setOpenEdit(false);

function updateField(e) {
    setEditPage({
      ...editPage,
      [e.target.name]: e.target.value,
    });
}

function isEmptyObject(obj) {
  for (var key in obj) {
    if (obj.hasOwnProperty(key)) {
      return false;
    }
  }
  return true;
}

const fetchUnenrolledUsers = async (index) => {
    return await axios.get(process.env.REACT_APP_API_URL + `/course/unenrolled-users?course_id=${courseRows[index].course_id}&course_code=${courseRows[index].course_code}&semester=${courseRows[index].semester}&user_roles=IS,ST`)
    .then((res) => {
        setIsLoading(true);
        if(res.data){
            let col =  [
                {field: 'id', width: 30, headerName: "ID", flex: 1},
                {field: 'user_id', width: 150, headerName: 'User ID', flex: 1},
                {field: 'name', width: 100, headerName: 'Name', flex: 1},
                {field: 'utorid', width: 150, headerName: 'UTORid', flex: 1},
                {field: 'user_role', width: 150, headerName: 'Role', flex: 1},
                {field: 'new_user', width: 150, headerName: 'New User', flex: 1},
            ];
            let data = [...res.data.instructors, ...res.data.students];
            setUnenrolledColumn(col);
            setUnenrolledRows(data.map((user, index) => ({id: index, ...user})));
            
        }
        setIsLoading(false);
    })
    .catch((err) => {
        // console.log(err);
        setIsLoading(false);
    });
}

const fetchAllCourses = async () => {
    return await axios
      .get(process.env.REACT_APP_API_URL + "/course/all")
      .then((res) => {
        if (res.data) {
          setIsLoading(true);
          setCourseTable(res.data);
          setIsLoading(false);
        }
      })
      .catch((err) => {
        // setError(err);
        // console.log(err);
        // onErrOpen();
        setIsLoading(false);
      });
};

const fetchTypeUsers = async (data, type, dataType) => {
  if(dataType === "INDEX"){
    return await axios.get(process.env.REACT_APP_API_URL + `/course/users?course_id=${courseRows[data].course_id}&course_code=${courseRows[data].course_code}&semester=${courseRows[data].semester}&user_roles=${type}`)
    .then((res) => {
           setIsLoading(true);
            if (res.data) {
                let col =  [
                        {field: 'id', width: 20, headerName: ""},
                        {field: 'user_id', width: 150, headerName: 'User ID', flex: 1},
                        {field: 'name', width: 100, headerName: 'Name', flex: 1},
                        {field: 'utorid', width: 150, headerName: 'UTORid', flex: 1},
                        {field: 'user_role', width: 150, headerName: 'Role', flex: 1},
                        // {field: 'model_id', width: 150, headerName: 'Model ID', flex: 1},
                        {field: 'new_user', width: 150, headerName: 'New User', flex: 1},
                    ];

                if (type === "IS") {
                    setInstructorRows(res.data.instructors.map((instructor, index) => ({...instructor, id: index})));
                    setInstructorColumn(col);
                }
                if (type === "ST") {
                    setStudentRows(res.data.students.map((student, index) => ({...student, id: index})));
                    setStudentColumn(col);
                }
            }
            setIsLoading(false);
    })
    .catch((err) => {
        // setError(err);
        // console.log(err);
        // onErrOpen();
        setIsLoading(false);
    });
  }else if(dataType === "ID"){
    return await axios.get(process.env.REACT_APP_API_URL + `/course/users?course_id=${courseRows[data].course_id}&course_code=${courseRows[data].course_code}&semester=${courseRows[data].semester}&user_roles=${type}`)
    .then((res) => {
           setIsLoading(true);
            if (res.data) {
                let col =  [
                        {field: 'id', width: 20, headerName: ""},
                        {field: 'user_id', width: 150, headerName: 'User ID', flex: 1},
                        {field: 'name', width: 100, headerName: 'Name', flex: 1},
                        {field: 'utorid', width: 150, headerName: 'UTORid', flex: 1},
                        {field: 'user_role', width: 150, headerName: 'Role', flex: 1},
                        // {field: 'model_id', width: 150, headerName: 'Model ID', flex: 1},
                        {field: 'new_user', width: 150, headerName: 'New User', flex: 1},
                    ];

                if (type === "IS") {
                    setInstructorRows(res.data.instructors.map((instructor, index) => ({...instructor, id: index})));
                    setInstructorColumn(col);
                }
                if (type === "ST") {
                    setStudentRows(res.data.students.map((student, index) => ({...student, id: index})));
                    setStudentColumn(col);
                }
            }
            setIsLoading(false);
    })
    .catch((err) => {
        // setError(err);
        // console.log(err);
        // onErrOpen();
        setIsLoading(false);
    });
  }
  
}

const setCourseTable =  (data) => {
    const rows = [];
    for (let i = 0; i < data.length; i++) {
      const course = data[i];
      rows.push({
        id: i,
        course_code: course.course_code,
        course_id: course.course_id,
        semester: course.semester,
        course_name: course.course_name,
        start_date: course.start_date.substring(0, 10),
        end_date: course.end_date.substring(0, 10),
      });
    }
    setCourseRows(rows);

    let courseCols = [
        {field: 'id', width: 20, headerName: ""},
        {field: 'course_code', width: 150, headerName: 'Course Code', flex: 1},
        {field: 'semester', width: 100, headerName: 'Semester', flex: 1},
        {field: 'course_name', width: 150, headerName: 'Course Name', flex: 1},
        {field: 'start_date', width: 150, headerName: 'Start Date', flex: 1},
        {field: 'end_date', width: 150, headerName: 'End Date', flex: 1},
    ];
    setCourseColumn(courseCols);
    };

    const style = {
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      width: '75%',
      height: 'auto',
      bgcolor: 'background.paper',
      border: '2px solid #000',
      boxShadow: 24,
      p: 4,
      overflow: 'scroll',
    };

  useEffect(() => {
    fetchAllCourses();
  }, [UTORID]);

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
        // paddingLeft: '16px',
        // paddingRight: '16px',
        paddingTop: '4px',
        paddingBottom: '4px',
    },
    // '& .MuiDataGrid-row': {
    //   color: red,
    //   backgroundColor: 'rgba(255, 0, 0, 0.04)',
    //   fontFamily: 'Poppins',
    // },
}))

if (!["IS", "AM", "RS"].includes(auth)) {
    return <NotFoundPage />;
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
    <TopNav UTORid={UTORID} auth={auth} />
    <Box overflow={"hidden"} ml={"12vw"} mr={"12vw"} pb={"20px"} textAlign='center'>
      <Box>
        <DataGrid
            rows={courseRows}
            columns={courseColumn}
            onRowSelectionModelChange={(newRowSelected) => {
                setIsLoading(true);
                fetchTypeUsers(newRowSelected, "IS", "INDEX");
                fetchTypeUsers(newRowSelected, "ST", "INDEX");
                fetchUnenrolledUsers(newRowSelected);
                console.log({
                  course_id: courseRows[newRowSelected].course_id,
                  course_code: courseRows[newRowSelected].course_code,
                  semester: courseRows[newRowSelected].semester
                });
                setCurrCourse({
                  course_id: courseRows[newRowSelected].course_id,
                  course_code: courseRows[newRowSelected].course_code,
                  semester: courseRows[newRowSelected].semester
                });
                setIsLoading(false);
            }}
        />
        <Box width='100%' textAlign='center'>
          <Button onClick={handleOpen} variant="contained" style={{backgroundColor: "#5D85D4", color: "white", marginTop: "20px", marginRight: "20px"}}>Add Unenrolled Users</Button>
          {(!isEmptyObject(currCourse) && auth==="AM") ? <>
                <Button onClick={handleEditOpen} variant="contained" style={{backgroundColor: "#5D85D4", color: "white", marginTop: "20px", marginLeft: "20px"}}>Edit Course Info</Button>
                <Modal
                  open={openEdit}
                  onClose={handleEditClose}
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
                        <Typography>Course Code</Typography>
                        <TextField
                          name="course_code"
                          onChange={updateField}
                          value={editPage.course_code}
                        ></TextField>
                      </Grid>
                      <Grid
                        item
                        xs={12}
                        mb={"1vw"}
                      >
                        <Typography>Course Name</Typography>
                        <TextField 
                          name="course_name"
                          onChange={updateField}
                          value={editPage.course_name}
                        ></TextField>
                      </Grid>                      
                      <Grid
                        item
                        xs={12}
                        mb={"1vw"}
                      >
                        <Typography>Semester</Typography>
                        <TextField 
                          name="semester"
                          onChange={updateField}
                          value={editPage.semester}
                        ></TextField>
                      </Grid>
                      <Grid
                        item
                        xs={12}
                        mb={"1vw"}
                      >
                        {/*<Typography>Start Date</Typography>*/}
                        {/*<TextField */}
                        {/*  name="start_date"*/}
                        {/*  onChange={updateField}*/}
                        {/*  value={editPage.start_date}*/}
                        {/*></TextField>*/}
                      </Grid>
                      <Grid
                        item
                        xs={12}
                        mb={"1vw"}
                      >
                        {/*<Typography>End Date</Typography>*/}
                        {/*<TextField */}
                        {/*  onChange={updateField}*/}
                        {/*  name="end_date"*/}
                        {/*  value={editPage.end_date}*/}
                        {/*></TextField>*/}
                      </Grid>
                      <Grid 
                        item
                        xs={12}
                      >
                      <Button
                        variant='contained'
                        onClick={() => {
                          axios.patch(process.env.REACT_APP_API_URL + `/course?course_id=${currCourse.course_id}&course_code=${currCourse.course_code}&semester=${currCourse.semester}`,
                              {
                                  course_code: editPage.course_code,
                                  semester: editPage.semester,
                                  course_name: editPage.course_name,
                              })
                          .then((res) => {
                            handleEditClose();
                            setEditPage({
                              course_code: "",
                              semester: "",
                              course_name: "",
                              start_date: "",
                              end_date: ""
                            });
                            alert("Course Info Updated");
                            fetchAllCourses();
                          })
                          .catch((err) => {
                            alert("Error: " + err);
                          })

                        }}
                      >Submit Edits</Button>
                      </Grid>  
                    </Grid>
                  </Box>
                </Modal>
              </> :
              <></>
              
          }
        </Box>
        <Box width='100%' textAlign='center'>
          <Modal
              open={open}
              onClose={handleClose}
              style={{
                  overflow: 'scroll',
              }}
          >
            <Box sx={style}>
              <Grid
                  container
                  spacing={2}
                  // direction="row"
                  alignItems="center"
                  justifyContent="center"
                  // width='100%'
                  // height='400px'
                  // overflow='scroll'
              >
                  <Grid item xs={12} mb={"3vw"}>
                      <Box  ml={"6vw"} mr={"6vw"} pb={"10px"} >
                        {
                          isLoading ? <div className="d-flex justify-content-center align-items-center" style={{height: "385px"}}> <CircularProgress /> </div>
                          : unenrolledRows.length === 0
                          ?   <Typography fontSize={"2xl"} fontWeight={"bold"} mb={"10px"}>
                                  No Unenrolled Users for this course
                              </Typography>
                              : unenrolledRows.length > 0 && unenrolledColumn.length > 0 &&
                                <DataGrid
                                  checkboxSelection
                                  rows={unenrolledRows}
                                  columns={unenrolledColumn}
                                  onRowSelectionModelChange={(ids) => {
                                    setSelectedUsers(new Set(ids));
                                  }}
                                  style={{
                                  width: '90%',
                                  height: 500,
                                  }}
                                />
                        }
                      </Box>
                  </Grid>

                  <Grid item xs={0} mb={"1vw"}>
                    <Tooltip title="Pick Users to Enroll">
                      <Button
                        variant="contained"
                        onClick={() => {
                          if(selectedUsers.size <= 0){
                            alert("Please pick users from the table to enroll");
                          }else{
                            let instructors = unenrolledRows.filter((row) => (selectedUsers.has(row.id) && row.user_role=='IS')).map((usr) => ({user_id: usr.user_id, utorid: usr.utorid, user_role: usr.user_role}));
                            let students = unenrolledRows.filter((row) => (selectedUsers.has(row.id) && row.user_role=='ST')).map((usr) => ({user_id: usr.user_id, utorid: usr.utorid, user_role: usr.user_role}));
                            console.log(instructors);
                            console.log(students);
                            if(students.length > 0){
                              axios.post(process.env.REACT_APP_API_URL + '/course/enroll/multiple', {
                                data: students,
                                course_id: currCourse.course_id,
                                course_code: currCourse.course_code,
                                semester: currCourse.semester,
                                user_role: 'ST'
                              })
                              .then((res) => {
                                fetchTypeUsers(currCourse.id, "ST", "ID");
                                alert('students enrolled');
                              })
                              .catch((err) => {
                                alert('error enrolling students');
                              })
                            }
                            if(instructors.length > 0){
                              axios.post(process.env.REACT_APP_API_URL + '/course/enroll/multiple', {
                                data: instructors,
                                course_id: currCourse.course_id,
                                course_code: currCourse.course_code,
                                semester: currCourse.semester,
                                user_role: 'IS'
                              })
                              .then((res) => {
                                fetchTypeUsers(currCourse.id, "IS", "ID");
                                alert('instructors enrolled');
                              })
                              .catch((err) => {
                                alert('error enrolling instructors');
                              })
                            }
                            handleClose();
                          }
                        }}>Enroll Users</Button>
                    </Tooltip>
                  </Grid>
              </Grid>
            </Box>
          </Modal>
        </Box>
      </Box>
      <Grid
        container
        spacing={1}
        direction="row"
        // alignItems="center"
        // justifyItems="center"
      >
          <Grid item xs={6}>
                {
                  isLoading ? <div className="d-flex justify-content-center align-items-center" style={{height: "385px"}}> <CircularProgress /> </div>
                  : instructorRows.length === 0
                  ?   <Typography fontSize={"2xl"} fontWeight={"bold"} mb={"10px"} mt={"10px"}>
                          No Instructors for this course
                      </Typography>
                      : instructorRows.length > 0 && instructColumn.length > 0 &&
                        <StyledDataGrid
                            rows={instructorRows}
                            columns={instructColumn}
                            style={{
                              width: '100%',
                              height: 400,
                              marginTop: '10px',
                              marginBottom: '10px',
                              paddingLeft: '10px',
                              paddingRight: '10px',
                            }}
                        />
                }
          </Grid>
          <Grid item xs={6}>
                {
                  isLoading ? <div className="d-flex justify-content-center align-items-center" style={{height: "385px"}}> <CircularProgress /> </div>
                  : studentRows.length === 0
                  ?   <Typography fontSize={"2xl"} fontWeight={"bold"} mb={"10px"} mt={"10px"}>
                          No Students for this course
                      </Typography>
                      : studentRows.length > 0 && studentColumn.length > 0 &&
                        <StyledDataGrid
                            rows={studentRows}
                            columns={studentColumn}
                            style={{
                              width: '100%',
                              height: 400,
                              marginTop: '10px',
                              marginBottom: '10px'
                            }}
                        />
                }
          </Grid>
    </Grid>
    </Box>
    </div>
) : null;
};

export default CoursesPage;