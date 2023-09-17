import {
  Button,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  HStack,
  Table,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  useDisclosure,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashCan } from "@fortawesome/free-solid-svg-icons";
import AddUser from "./AddUser";

const CourseDrawer = ({ isOpen, onClose, course_id }) => {
  const [studentList, setStudentList] = useState([]);
  const [disableFlag, setDisableFlag] = useState(false);
  const {
    isOpen: isOpenInstructors,
    onOpen: onOpenInstructors,
    onClose: onCloseInstructors,
  } = useDisclosure();
  const {
    isOpen: isOpenStudent,
    onOpen: onOpenStudent,
    onClose: onCloseStudent,
  } = useDisclosure();
  const fetchCourseList = async (course_id) => {
    let user_roles = "ST";
    await axios
      .get(
        process.env.REACT_APP_API_URL +
          `/course/users?course_id=${course_id}&user_roles=${user_roles}`
      )
      .then((res) => {
        setStudentList(res.data.students);
      })
      .catch((err) => console.log(err));
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

  const deleteUser = (course_id, user_id, role = "student") => {
    axios
      .delete(
        process.env.REACT_APP_API_URL +
          `/course/enroll?course_id=${course_id}&user_id=${user_id}&type=${role}`
      )
      .then((res) => {})
      .catch((err) => console.log(err));
  };

  const deleteElement = (user_id) => {
    console.log("delete " + user_id);
    let filtered = studentList.filter((student) => student.user_id !== user_id);
    setStudentList(filtered);
  };

  useEffect(() => {
    if (course_id) {
      setDisableFlag(true);
      fetchCourseList(course_id).then(() => {
        setDisableFlag(false);
      });
      console.log(studentList);
    }
  }, [course_id]);

  return (
    <>
      <Drawer isOpen={isOpen} placement={"right"} onClose={onClose}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>Edit Course List</DrawerHeader>
          <DrawerBody>
            <HStack>
              <Button onClick={onOpenStudent} isDisabled={disableFlag}>
                Add Student
              </Button>
              <AddUser
                type={"ST"}
                course_id={course_id}
                onClose={onCloseStudent}
                isOpen={isOpenStudent}
                handleClose={fetchCourseList}
                parentDisable={setDisableFlag}
              />
              <Button onClick={onOpenInstructors} isDisabled={disableFlag}>
                Add Instructor
              </Button>
              <AddUser
                type={"IS"}
                course_id={course_id}
                onClose={onCloseInstructors}
                isOpen={isOpenInstructors}
                handleClose={fetchCourseList}
                parentDisable={setDisableFlag}
              />
            </HStack>
            <TableContainer>
              <Table variant={"striped"} colorScheme={"blue"}>
                <Thead>
                  <Tr>
                    <Th>utorid</Th>
                    <Th>name</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {studentList.map((student, index) => {
                    return (
                      <Tr>
                        <Td>{student.utorid}</Td>
                        <Td>{student.name}</Td>
                        <Td>
                          <Button variant={"ghost"} isDisabled={disableFlag}>
                            <FontAwesomeIcon
                              icon={faTrashCan}
                              size={"2x"}
                              onClick={() => {
                                //  Remove student from classroom and get new list of students
                                setDisableFlag(true);
                                deleteUser(course_id, student.user_id);
                                deleteElement(student.user_id);
                                setDisableFlag(false);
                              }}
                            />
                          </Button>
                        </Td>
                      </Tr>
                    );
                  })}
                </Tbody>
              </Table>
            </TableContainer>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
};

export default CourseDrawer;
