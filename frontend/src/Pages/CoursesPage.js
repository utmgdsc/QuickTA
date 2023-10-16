import {Box, useDisclosure} from "@chakra-ui/react";
import {useEffect, useState} from "react";
import NotFoundPage from "../Components/NotFoundPage";
import axios from "axios";
import TopNav from "../Components/TopNav";
import * as React from "react";
import ErrorDrawer from "../Components/ErrorDrawer";
import { DataGrid } from "@mui/x-data-grid";
import { styled } from "@mui/material/styles";
import {red} from "@mui/material/colors";

const CoursesPage = ({ UTORID, auth }) => {
const {
    isOpen: isErrOpen,
    onOpen: onErrOpen,
    onClose: onErrClose,
} = useDisclosure();
const [error, setError] = useState();
const [selectCourse, setSelectCourse] = useState([]);
const [courseRows, setCourseRows] = useState([]);
const [courseColumn, setCourseColumn] = useState([]);
const [studentRows, setStudentRows] = useState([]);
const [studentColumn, setStudentColumn] = useState([]);
const [instructorRows, setInstructorRows] = useState([]);
const [instructColumn, setInstructorColumn] = useState([]);


const fetchAllCourses = () => {
    axios
      .get(process.env.REACT_APP_API_URL + "/course/all")
      .then((res) => {
        if (res.data) {
          setCourseTable(res.data);
        }
      })
      .catch((err) => {
        setError(err);
        console.log(err);
        onErrOpen();
      });
};

const fetchTypeUsers = (index, type) => {
    axios.get(process.env.REACT_APP_API_URL + `/course/users?course_id=${courseRows[index].course_id}&course_code=${courseRows[index].course_code}&semester=${courseRows[index].semester}&user_roles=${type}`)
    .then((res) => {
           if (res.data) {
                let col =  [
                        {field: 'id', width: 20, headerName: ""},
                        {field: 'user_id', width: 150, headerName: 'User ID'},
                        {field: 'name', width: 100, headerName: 'Name'},
                        {field: 'utorid', width: 150, headerName: 'UTORid'},
                        {field: 'user_role', width: 150, headerName: 'Role'},
                        {field: 'model_id', width: 150, headerName: 'Model ID'},
                        {field: 'new_user', width: 150, headerName: 'New User'},
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
    })
    .catch((err) => {
        setError(err);
        // console.log(err);
        onErrOpen();
    });
}
const getUserRole = (role) => {
    switch (role) {
      case "AM": return "Admin";
      case "RS": return "Researcher";
      case "IS": return "Instructor";
      case "TA": return "Teaching Assistant";
      case "ST": return "Student";
      default: return "";
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
        {field: 'course_code', width: 150, headerName: 'Course Code'},
        {field: 'semester', width: 100, headerName: 'Semester'},
        {field: 'course_name', width: 150, headerName: 'Course Name'},
        {field: 'start_date', width: 150, headerName: 'Start Date'},
        {field: 'end_date', width: 150, headerName: 'End Date'},
    ];
    setCourseColumn(courseCols);
    };

const setStudentTable =  (data) => {
        const rows = [];
        for (let i = 0; i < data.length; i++) {
          let students = data[i].students;
          for (let j = 0; j < students.length; j++) {
            let student = students[j];
            rows.push({
            id: j,
            user_id: student.user_id,
            name: student.name,
            utorid: student.utorid,
            user_role: 'Student',
            model_id: student.model_id,
            new_user: student.new_user,
            });
          }
        }
        console.log(rows);
        setStudentRows(rows);

        let studentCol = [
            {field: 'id', width: 20, headerName: ""},
            {field: 'user_id', width: 150, headerName: 'User ID'},
            {field: 'name', width: 100, headerName: 'Name'},
            {field: 'utorid', width: 150, headerName: 'UTORid'},
            {field: 'user_role', width: 150, headerName: 'Role'},
            {field: 'model_id', width: 150, headerName: 'Model ID'},
            {field: 'new_user', width: 150, headerName: 'New User'},
        ];
        setStudentColumn(studentCol);
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
    <Box overflow={"hidden"} ml={"12vw"} mr={"12vw"} pb={"20px"}>
        <Box>
            <StyledDataGrid
                rows={courseRows}
                columns={courseColumn}
                onRowSelectionModelChange={(newRowSelected) => {
                    fetchTypeUsers(newRowSelected, "IS");
                    fetchTypeUsers(newRowSelected, "ST");
                }}
            />
        </Box>
    </Box>
    <Box overflow={"hidden"} ml={"12vw"} mr={"12vw"} pb={"20px"}>
        <Box>
            <StyledDataGrid
                rows={instructorRows}
                columns={instructColumn}
            />
        </Box>
    </Box>
    <Box overflow={"hidden"} ml={"12vw"} mr={"12vw"} pb={"20px"}>
        <Box>
            <StyledDataGrid
                rows={studentRows}
                columns={studentColumn}
            />
        </Box>
    </Box>
    <ErrorDrawer error={error} isOpen={isErrOpen} onClose={onErrClose} />
    </div>
) : null;
};

export default CoursesPage;