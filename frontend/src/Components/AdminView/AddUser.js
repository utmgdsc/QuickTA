import {
  Button, Checkbox,
  HStack,
  Input, InputGroup,
  InputLeftAddon,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay, Spacer, Stack, Table, TableContainer, Tbody, Td, Th, Thead, Tr
} from "@chakra-ui/react";
import {useEffect, useState} from "react";
import {hashing} from "../../utls/hashing";
import axios from "axios";

const AddUser = ({course_id, isOpen, onClose, type}) => {
  const [userList, setUserList] = useState([]);
  const [toAdd, setToAdd] = useState([]);

  const fetchUnenrolledUsers = (course_id, type) => {
    axios.get(process.env.REACT_APP_API_URL + `/admin/get-course-unadded-users/?course_id=${course_id}&type=${type}`)
      .then((res) => {
        if(res.data.users){
          setUserList(res.data.users);
          setToAdd(Array(res.data.users.length).fill(false));
        }
      })
      .catch((err) => console.log(err))
  }

  useEffect(() => {
    if (course_id){
      fetchUnenrolledUsers(course_id, type);
    }
  }, [course_id])

  return(
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay/>
      <ModalContent>
        <ModalHeader>Add {type === "instructor" ? "Instructors" : "Students"}</ModalHeader>
        <ModalCloseButton/>

        <ModalBody>
          <Stack spacing={3}>
            <InputGroup>
              <InputLeftAddon children={"UTORid"}/>
              <Input type={'text'} variant={'outline'}/>
            </InputGroup>

            <InputGroup>
              <InputLeftAddon children={"Name"}/>
              <Input type={'text'} variant={'outline'}/>
            </InputGroup>

            <TableContainer>
              <Table>
                <Thead>
                  <Tr>
                    <Th>UTORid</Th>
                    <Th>Name</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {userList.map((user, index) => {
                    return (<Tr key={user.user_id}>
                      <Td key={hashing(user.utorid)}>{user.utorid}</Td>
                      <Td key={hashing(user.name)}>{user.name}</Td>
                      <Td key={user.user_role}>{<Checkbox onChange={(e) => {
                        // let filtered = userList.filter((e) => e.user_id !== user.user_id);
                        let filter = toAdd;
                        filter[index] = !filter[index]
                        setToAdd(filter);
                        // setUserList(filtered);

                      }}/>}</Td>
                    </Tr>)
                  })}
                </Tbody>
              </Table>
            </TableContainer>

            <HStack>
              <Spacer/>
              <Button variant={'solid'} onClick={() => {
                let users = toAdd.reduce((add, index) => {
                  if(add){
                      return userList[index].user_id
                  }
                })
                axios.post(process.env.REACT_APP_API_URL + "/admin/add-multiple-user-course", {users: users, course_id: course_id, type: (type==="student" ? "student" : "instructor")})
                  .then((res) => {})
                  .catch((err) => console.log(err))
              }}>Add</Button>
            </HStack>

          </Stack>

        </ModalBody>
      </ModalContent>


    </Modal>
  )
}

export default AddUser;