import {
  Box,
  Button,
  Center,
  Drawer,
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
} from "@chakra-ui/react";
import TopNav from "../Components/TopNav";
import axios from "axios";
import { useEffect, useRef, useState } from "react";
import CourseDrawer from "../Components/AdminView/CourseDrawer";
import CourseCreator from "../Components/Dashboard/CourseCreator";

const AdminPage = ({ UTORID }) => {
  const [courseIndex, setCourseIndex] = useState(0);
  const [courseList, setCourseList] = useState([]);
  const { isOpen, onOpen, onClose } = useDisclosure();

  const [isOpenCreateUser, setIsOpenCreateUser] = useState(false);
  const [name, setName] = useState("");
  const [utorid, setUtorid] = useState("");
  const [userRole, setUserRole] = useState("ST");
  const userid = sessionStorage.getItem("userid");
  const [courses, setCourses] = useState([]);
  const [currCourse, setCurrCourse] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingCourses, setIsLoadingCourses] = useState(false);

  const handleSubmit = () => {
    const payload = { name, utorid, user_role: userRole };
    axios
      .post(process.env.REACT_APP_API_URL + "/admin/add-user", payload)
      .then((response) => {
        return response.json();
      })
      .catch((error) => {
        console.log(error);
      });
    setIsOpenCreateUser(false);
  };

  const fetchAllCourses = () => {
    axios
      .get(process.env.REACT_APP_API_URL + "/admin/get-all-courses")
      .then((res) => {
        if (res.data.courses) {
          setCourseList(res.data.courses);
        }
      })
      .catch((err) => {});
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
    if (UTORID.length !== 0) {
      fetchAllCourses();
      setIsLoadingCourses(true);
    }
  }, [UTORID]);

  return UTORID.length !== 0 ? (
    <div
      style={{
        backgroundColor: "#F1F1F1",
        width: "100vw",
        height: "100vw",
      }}
    >
      <TopNav UTORid={UTORID} />
      <Box overflow={"hidden"} ml={"12vw"} mr={"12vw"}>
        <HStack>
          <CourseCreator
            userid={userid}
            setCourses={setCourses}
            setCurrCourse={setCurrCourse}
            setIsLoading={setIsLoading}
          />
          {/* <Button style={{backgroundColor: '#2C54A7', color: 'white'}} fontSize={'sm'} >
            Create New Course
          </Button> */}
          <Button
            style={{ backgroundColor: "#2C54A7", color: "white" }}
            fontSize={"sm"}
            onClick={() => setIsOpenCreateUser(true)}
          >
            Create User (manually)
          </Button>
        </HStack>
        {/* Modal for Creating User */}
        <Modal
          isOpen={isOpenCreateUser}
          onClose={() => setIsOpenCreateUser(false)}
        >
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Create User</ModalHeader>
            <ModalBody>
              <FormControl>
                <FormLabel>Name</FormLabel>
                <Input
                  placeholder="Enter name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </FormControl>
              <FormControl mt={4}>
                <FormLabel>UTORid</FormLabel>
                <Input
                  placeholder="Enter UTORid"
                  value={utorid}
                  onChange={(e) => setUtorid(e.target.value)}
                />
              </FormControl>
              <FormControl mt={4}>
                <FormLabel>User Role</FormLabel>
                <Select
                  placeholder="Select user role"
                  value={userRole}
                  onChange={(e) => setUserRole(e.target.value)}
                >
                  <option value="ST">Student</option>
                  <option value="IS">Instructor</option>
                  <option value="AM">Admin</option>
                </Select>
              </FormControl>
            </ModalBody>
            <ModalFooter>
              <Button
                variant="ghost"
                onClick={() => setIsOpenCreateUser(false)}
              >
                Cancel
              </Button>
              <Button colorScheme="blue" ml={3} onClick={handleSubmit}>
                Submit
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>

        <TableContainer>
          <Table
            size="md"
            style={{
              marginTop: "1rem",
              backgroundColor: "white",
              borderRadius: "0.5rem",
            }}
          >
            <Thead
              style={{
                backgroundColor: "#5E85D4",
                borderRadius: "0.5rem",
              }}
            >
              <Tr>
                <Th color={"white"}>Course ID</Th>
                <Th color={"white"}>Semester</Th>
                <Th color={"white"}>Instructors</Th>
              </Tr>
            </Thead>
            {courseList.length !== 0 ? (
              <Tbody>
                {courseList.map((obj, index) => {
                  return (
                    <Tooltip
                      key={obj.toString()}
                      label={"Click on me to edit course list"}
                    >
                      <Tr
                        key={hashing(obj.course_id)}
                        onClick={() => {
                          setCourseIndex(index);
                          console.log(courseList[courseIndex]);
                          onOpen();
                        }}
                        style={{
                          cursor: "pointer", // Change cursor to pointer
                          backgroundColor:
                            index % 2 == 0 ? "transparent" : "#EDF5FD", // Initial background color
                          transition: "background-color 0.3s", // Add a smooth transition
                        }}
                        onMouseEnter={(e) => {
                          // Change background color on hover
                          e.currentTarget.style.backgroundColor = "#e0e0e0"; // Change to your desired hover color
                        }}
                        onMouseLeave={(e) => {
                          // Reset background color on mouse leave
                          e.currentTarget.style.backgroundColor =
                            index % 2 == 0 ? "transparent" : "#EDF5FD";
                        }}
                      >
                        <Td key={hashing(obj.course_name)}>
                          {obj.course_name}
                        </Td>
                        <Td key={hashing(obj.semester)}>{obj.semester}</Td>
                        <Td key={hashing(obj.instructors.toString())}>
                          {obj.instructors.join(", ")}
                        </Td>
                      </Tr>
                    </Tooltip>
                  );
                })}
              </Tbody>
            ) : isLoadingCourses ? (
              <Tbody>
                {[1, 2, 3].map((item) => (
                  <Tr key={item}>
                    <Td>
                      <Skeleton height="12px" width="100%" />
                    </Td>
                    <Td>
                      <Skeleton height="12px" width="100%" />
                    </Td>
                    <Td>
                      <Skeleton height="12px" width="100%" />
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            ) : (
              <Tbody>
                <Td colSpan={3}>
                  <Center>No Courses Found</Center>
                </Td>
              </Tbody>
            )}
          </Table>
        </TableContainer>
        {courseList.length !== 0 ? (
          <CourseDrawer
            isOpen={isOpen}
            onClose={onClose}
            course_id={courseList[courseIndex].course_id}
          />
        ) : isLoadingCourses ? (
          <VStack></VStack>
        ) : (
          <VStack>
            <Center>No Courses Found</Center>
          </VStack>
        )}
      </Box>
    </div>
  ) : null;
};

export default AdminPage;
