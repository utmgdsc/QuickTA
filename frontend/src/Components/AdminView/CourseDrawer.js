import {
  Button,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay, HStack, Table, Thead, Tr
} from "@chakra-ui/react";
import {useEffect, useState} from "react";
import axios from "axios";


const CourseDrawer = ({isOpen, onClose, course_id}) => {
  const [studentList, setStudentList] = useState([])
  const fetchCourseList = async (course_id) => {
    await axios.get(process.env.REACT_APP_API_URL + "/admin/get-course-user")
      .then((res) => {
        setStudentList(res.data.students.reduce((obj, student) => {
          return [...obj, {utorid: student.utorid, name: student.name}]
        }, []))
      })
      .catch((err) => {})
  }

  useEffect(() => {
    if(course_id){
      fetchCourseList(course_id)
    }
  }, [course_id])

  return(

    <Drawer
      isOpen={isOpen}
      placement={'right'}
      onClose={onClose}
    >
      <DrawerOverlay/>
      <DrawerContent>
        <DrawerCloseButton />
        <DrawerHeader>Edit Course List</DrawerHeader>

        <DrawerBody>
          <HStack>
            <Button>Add Student</Button>
            <Button>Add Instructor</Button>
          </HStack>
          <Table>
          <Thead>
            <Tr>{}</Tr>
            <Tr>{}</Tr>
            <Tr>{}</Tr>
          </Thead>
          </Table>
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  )
}

export default CourseDrawer;