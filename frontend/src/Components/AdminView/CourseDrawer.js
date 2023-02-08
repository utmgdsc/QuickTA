import {
  Button,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay, HStack, Table, TableContainer, Tbody, Td, Th, Thead, Tr
} from "@chakra-ui/react";
import {useEffect, useState} from "react";
import axios from "axios";

const CourseDrawer = ({isOpen, onClose, course_id}) => {
  const [studentList, setStudentList] = useState([])
  const fetchCourseList = async (course_id) => {
    await axios.get(process.env.REACT_APP_API_URL + `/admin/get-course-users/${course_id}/`)
      .then((res) => {
        setStudentList(res.data.students)
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
    if(course_id){
      fetchCourseList(course_id)
      console.log(studentList)
    }
  }, [course_id])

  return(
    <>
      <Drawer
        isOpen={isOpen}
        placement={'right'}
        onClose={onClose}
      >
        <DrawerOverlay/>
        <DrawerContent>
          <DrawerCloseButton/>
          <DrawerHeader>Edit Course List</DrawerHeader>
          <DrawerBody>
            <HStack>
              <Button>Add Student</Button>
              <Button>Add Instructor</Button>
            </HStack>
            <TableContainer>
              <Table variant={'striped'}>
                <Thead>
                  <Tr>
                    <Th>utorid</Th>
                    <Th>name</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {studentList.map((student, index) => {
                   return( <Tr key={hashing(student.user_id)}>
                      <Td key={hashing(student.utorid)}>{student.utorid}</Td>
                      <Td key={hashing(student.name)}>{student.name}</Td>
                    </Tr>)
                  })}
                </Tbody>
              </Table>
            </TableContainer>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  )
}

export default CourseDrawer;