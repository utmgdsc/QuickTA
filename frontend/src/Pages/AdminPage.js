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
} from "@chakra-ui/react";
import TopNav from "../Components/TopNav";
import axios from "axios";
import {useEffect, useRef, useState} from "react";
import CourseDrawer from "../Components/AdminView/CourseDrawer"


const AdminPage = ({ UTORID }) => {
  const [courseIndex, setCourseIndex] = useState(0);
  const [courseList, setCourseList] = useState([]);
  const { isOpen, onOpen, onClose } = useDisclosure();


  const fetchAllCourses = () => {
    axios.get(process.env.REACT_APP_API_URL + "/admin/get-all-courses")
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
          <Button style={{backgroundColor: '#2C54A7', color: 'white'}} fontSize={'sm'} >
            Create New Course
          </Button>
          <Button style={{backgroundColor: '#2C54A7', color: 'white'}} fontSize={'sm'}>
            Create User (manually)
          </Button>
        </HStack>
        <TableContainer>
        <Table>
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
        {courseList.length !== 0 ? <CourseDrawer isOpen={isOpen} onClose={onClose} course_id={courseList[courseIndex].course_id}/> : <VStack><Center>No reported Conversations!</Center></VStack>}
      </Box>

    </div> : null
  );
}

export default AdminPage;