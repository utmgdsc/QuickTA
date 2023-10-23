import {
    CloseButton,
    HStack,
    Input,
    Modal,
    VStack,
    useDisclosure,
    ModalBody,
    ModalHeader,
    ModalContent,
    ModalOverlay,
    Box,
    ModalFooter, Text,
    Button, ModalCloseButton,
} from "@chakra-ui/react";
import ErrorDrawer from "./ErrorDrawer";
import { useEffect, useState } from "react";
import {styled} from "@mui/material/styles";
import {DataGrid} from "@mui/x-data-grid";
import {red} from "@mui/material/colors";
import axios from "axios";

const CourseInfo = ({course_code, semester, course_id, auth, isOpen, onClose}) => {
const {
    isOpen: isErrOpen,
    onOpen: onErrOpen,
    onClose: onErrClose,
} = useDisclosure();
const { isOpen: tisopen, onOpen: tnopen, onClose: tclose } = useDisclosure()
const [error, setError] = useState();
const [studentRows, setStudentRows] = useState([]);
const [studentColumn, setStudentColumn] = useState([]);
const [instructorRows, setInstructorRows] = useState([]);
const [instructColumn, setInstructorColumn] = useState([]);
const [editField, setEditField] = useState({course_code: course_code, semester: semester});
const [editing, setEditing] = useState(false);

const fetchTypeUsers = (type) => {
    axios.get(process.env.REACT_APP_API_URL + `/course/users?course_id=${course_id}&course_code=${course_code}&semester=${semester}&user_roles=${type}`)
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

function updateField(e) {
    setEditField({
      ...editField,
      [e.target.name]: e.target.value,
    });
  }


useEffect(() => {
    if (auth) {
        fetchTypeUsers("IS");
        fetchTypeUsers("ST");
    }
}, [course_code, semester]);

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

return (
    <>
      <Button onClick={tnopen}>Open Modal</Button>SS

      <Modal isOpen={tisopen} onClose={tclose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Modal Title</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme='blue' mr={3} onClick={onClose}>
              Close
            </Button>
            <Button variant='ghost'>Secondary Action</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
);
}

export default CourseInfo;