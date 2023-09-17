import {
  Box,
  Button, Center,
  Drawer,
  HStack,
  Table,
  TableContainer,
  Tbody,
  Td, Th,
  Thead,
  Tooltip,
  Tr,
  useDisclosure, VStack,
   Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, FormControl, FormLabel, Input, Select 
} from "@chakra-ui/react";
import TopNav from "../Components/TopNav";
import axios from "axios";
import {useEffect, useRef, useState} from "react";
import CourseDrawer from "../Components/AdminView/CourseDrawer"
import CourseCreator from "../Components/Dashboard/CourseCreator";


const AdminPage = ({ UTORID }) => {
  const [courseIndex, setCourseIndex] = useState(0);
  const [courseList, setCourseList] = useState([]);
  const { isOpen, onOpen, onClose } = useDisclosure();

  const [isOpenCreateUser, setIsOpenCreateUser] = useState(false);
  const [name, setName] = useState('');
  const [utorid, setUtorid] = useState('');
  const [userRole, setUserRole] = useState('ST');
  const userid = sessionStorage.getItem('userid');
  const [courses, setCourses] = useState([]) ;
  const [currCourse, setCurrCourse] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = () => {
    const payload = { name, utorid, user_role: userRole };
    axios.post(process.env.REACT_APP_API_URL + "/user/enroll",
      payload)
    .then(response => {
      return response.json();
    }).catch(error => {
      console.log(error);
    });
    setIsOpenCreateUser(false);
  }


  const fetchAllCourses = () => {
    axios.get(process.env.REACT_APP_API_URL + "/course/all")
      .then((res) => {
        if(res.data.courses){
          setCourseList(res.data.courses)
        }
      })
      .catch((err) => {})
  }

  const hashing = (str, seed = 0) => {
    let h1 = 0xdeadbeef ^ seed,
      h2 = 0x41c6ce57 ^ seed;
    for (let i = 0, ch; i < str.length; i++) {
      ch = str.charCodeAt(i);
      h1 = Math.imul(h1 ^ ch, 2654435761);
      h2 = Math.imul(h2 ^ ch, 1597334677);
    }

    h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507) ^ Math.imul(h2 ^ (h2 >>> 13), 3266489909);
    h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507) ^ Math.imul(h1 ^ (h1 >>> 13), 3266489909);

    return 4294967296 * (2097151 & h2) + (h1 >>> 0);
  };


  useEffect(() => {
    if(UTORID.length !== 0){
      fetchAllCourses()
    }
  }, [UTORID])

  return(
    UTORID.length !== 0 ?
    <div style={{
      backgroundColor: "#F1F1F1",
      width: "100vw",
      height: '100vw'
    }}>
      <TopNav UTORid={ UTORID }/>
      <Box overflow={'hidden'} ml={'12vw'} mr={'12vw'}>
        <HStack>
          <CourseCreator userid={userid} setCourses={setCourses} setCurrCourse={setCurrCourse} setIsLoading={setIsLoading}/>
          {/* <Button style={{backgroundColor: '#2C54A7', color: 'white'}} fontSize={'sm'} >
            Create New Course
          </Button> */}
          <Button style={{backgroundColor: '#2C54A7', color: 'white'}} fontSize={'sm'}
            onClick={() => setIsOpenCreateUser(true)}>
            Create User (manually)
          </Button>
        </HStack>
      {/* Modal for Creating User */}
        <Modal isOpen={isOpenCreateUser} onClose={() => setIsOpenCreateUser(false)}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Create User</ModalHeader>
          <ModalBody>
            <FormControl>
              <FormLabel>Name</FormLabel>
              <Input placeholder="Enter name" value={name} onChange={(e) => setName(e.target.value)} />
            </FormControl>
            <FormControl mt={4}>
              <FormLabel>UTORid</FormLabel>
              <Input placeholder="Enter UTORid" value={utorid} onChange={(e) => setUtorid(e.target.value)} />
            </FormControl>
            <FormControl mt={4}>
              <FormLabel>User Role</FormLabel>
              <Select placeholder="Select user role" value={userRole} onChange={(e) => setUserRole(e.target.value)}>
                <option value="ST">Student</option>
                <option value="IS">Instructor</option>
                <option value="AM">Admin</option>
              </Select>
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" onClick={() => setIsOpenCreateUser(false)}>Cancel</Button>
            <Button colorScheme="blue" ml={3} onClick={handleSubmit}>Submit</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

        <TableContainer>
        <Table
          style={{
            marginTop: '1rem',
            backgroundColor: 'white',
            borderRadius: '0.5rem',
          }}>
          <Thead>
            <Tr>
              <Th>Course ID</Th>
              <Th>Semester</Th>
              <Th>Instructors</Th>
            </Tr>
          </Thead>
          <Tbody>
            {courseList.map((obj, index) => {
              return(
                <Tooltip key={obj.toString()} label={"Click on me to edit course list"}>
                  <Tr key={hashing(obj.course_id)} onClick={() => {
                  //   Open the chakra drawer to display
                    setCourseIndex(index);
                    console.log(courseList[courseIndex])
                    onOpen();
                  }
                  }>
                    <Td key={hashing(obj.course_name)}>{obj.course_name}</Td>
                    <Td key={hashing(obj.semester)}>{obj.semester}</Td>
                    <Td key={hashing(obj.instructors.toString())}>{obj.instructors.toString()}</Td>
                  </Tr>
                </Tooltip>
              )
            })}
          </Tbody>
        </Table>
        </TableContainer>
        {courseList.length !== 0 
          ?  <CourseDrawer isOpen={isOpen} onClose={onClose} course_id={courseList[courseIndex].course_id}/> 
          : <VStack><Center>No Courses Found</Center></VStack>}
      </Box>

    </div> : null
  );
}

export default AdminPage;