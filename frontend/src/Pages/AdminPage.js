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
  const [courseIndex, setRowIndex] = useState(0);
  const [courseList, setCourseList] = useState([]);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const openDrawer = useRef(0);


  const fetchAllCourses = () => {
    axios.get(process.env.REACT_APP_API_URL + "/admin/get-all-courses")
      .then((res) => {
        if(res.data.courses){
          setCourseList(res.data.courses)
        }
      })
      .catch((err) => {})
  }

  useEffect(() => {
    if(UTORID.length !== 0){
      fetchAllCourses()
    }
  }, [UTORID])

  useEffect(() => {
    if(courseIndex){
      console.log(openDrawer)
    }
  }, [courseIndex])

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
                <Tooltip label={"Click on me to edit course list"}>
                  <Tr key={index} onClick={() => {
                  //   Open the chakra drawer to display
                    setRowIndex(index);
                    console.log(index, courseList);
                  }
                  }>
                    <Td key={}>{obj.course_name}</Td>
                    <Td key={}>{obj.semester}</Td>
                    <Td key={}>{obj.instructors.toString()}</Td>
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