import {
    Box,
    Button,
    Center,
    HStack,
    Table,
    TableContainer,
    Tbody,
    Td,
    Th,
    Thead,
    Tooltip,
    Tr,
    useDisclosure,
    VStack,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    FormControl,
    FormLabel,
    Input,
    Select,
    Skeleton,
    ButtonGroup,
    IconButton,
} from "@chakra-ui/react";
import { SearchIcon } from "@chakra-ui/icons";
import TopNav from "../Components/TopNav";
import axios from "axios";
import { useEffect, useState } from "react";
import CourseDrawer from "../Components/AdminView/CourseDrawer";
import CourseCreator from "../Components/Dashboard/CourseCreator";
import { AiFillContainer } from "react-icons/ai";
import NotFoundPage from "../Components/NotFoundPage";
import ErrorDrawer from "../Components/ErrorDrawer";
import * as React from 'react';
import { DataGrid, GridRowsProp, GridColDef, DATA_GRID_PROPS_DEFAULT_VALUES } from '@mui/x-data-grid';
// When using TypeScript 4.x and above
import { createTheme } from '@mui/material/styles';
import { styled } from '@mui/material/styles';
import { ThemeProvider } from '@mui/material/styles';
import { green } from '@mui/material/colors';
import { red } from '@mui/material/colors';

const SettingPage = ({ UTORID, auth }) => {
const {
    isOpen: isErrOpen,
    onOpen: onErrOpen,
    onClose: onErrClose,
} = useDisclosure();
const [error, setError] = useState();
const [courseList, setCourseList] = useState([]);
const [userList, setUserList] = useState([]);
const [rows, setRows] = useState([]);
const [columns, setColumns] = useState([]);

// const fetchAllCourses = () => {
//     axios
//       .get(process.env.REACT_APP_API_URL + "/course/all")
//       .then((res) => {
//         if (res.data) {
//           setCourseList(res.data);
//           setTable(res.data);
//         }
//       })
//       .catch((err) => {
//         setError(err);
//         // console.log(err);
//         onErrOpen();
//       });
//   };

const fetchAllUsers = () => {
    axios
      .get(process.env.REACT_APP_API_URL + "/user/all")
      .then((res) => {
        if (res.data) {
          setUserList(res.data);
          setTable(res.data);
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

  const setTable =  (data) => { 
    const rows = [];
    for (let i = 0; i < data.length; i++) {
      const user = data[i];
      rows.push({
        id: i,
        utorid: user.utorid,
        name: user.name,
        role: getUserRole(user.user_role),
        'New User': user.new_user,
        'Model': user.model_id ? user.model_id : "N/A",


        // course_code: course.course_code,
        // course_name: course.course_name,
        // semester: course.semester,
        // instructors: getInstructors(course.instructors),
      });
    }
    setRows(rows);

    let columns = [
      { field: 'id', width: 20, headerName: "" },
      { field: 'utorid', width: 110, headerName: "UTORid" },
      { field: 'name', width: 150, headerName: "Name" },
      { field: 'role', width: 100, headerName: "Role" },
      { field: 'New User', width: 100, headerName: "New User" },
      { field: 'Model', width: 150, headerName: "Model" },
    ];
    setColumns(columns);
  }

  const getInstructors = (instructors) => {
    let instructorString = "";
    instructors.forEach((instructor) => {
      instructorString += instructor.utorid + ", ";
    });
    return instructorString.slice(0, -2);
  };

  const hashing = (str, seed = 0) => {
    let h1 = 0xdeadbeef ^ seed,
      h2 = 0x41c6ce57 ^ seed;
    for (let i = 0, ch; i < str.length; i++) {
      ch = str.charCodeAt(i);
      h1 = Math.imul(h1 ^ ch, 2654435761);
      h2 = Math.imul(h2 ^ ch, 1597334677);
    }

    h1 =
      Math.imul(h1 ^ (h1 >>> 16), 2246822507) ^
      Math.imul(h2 ^ (h2 >>> 13), 3266489909);
    h2 =
      Math.imul(h2 ^ (h2 >>> 16), 2246822507) ^
      Math.imul(h1 ^ (h1 >>> 13), 3266489909);

    return 4294967296 * (2097151 & h2) + (h1 >>> 0);
  };

  useEffect(() => {
    fetchAllUsers();
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
  

if (auth !== "AM") {
    return <NotFoundPage />;
}

return UTORID.length !== 0 ? (
    <div
    style={{
        backgroundColor: "#F1F1F1",
        width: "100vw",
        minHeight: "100vh",
    }}
    >
    <TopNav UTORid={UTORID} auth={auth} />
    <Box overflow={"hidden"} ml={"12vw"} mr={"12vw"} pb={"20px"}>
      <Box>
        <StyledDataGrid rows={rows} columns={columns} />
      </Box>
    </Box>
    <ErrorDrawer error={error} isOpen={isErrOpen} onClose={onErrClose} />
    </div>
) : null;
};

export default SettingPage;
