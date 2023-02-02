import {Button, HStack, Table} from "@chakra-ui/react";
import TopNav from "../Components/TopNav";


const AdminPage = ({ UTORID }) => {
  return(
    <>
      <TopNav UTORid={UTORID}/>
      <HStack>
        <Button style={{backgroundColor: '#2C54A7', color: 'white'}} fontSize={'sm'} >
          Create New Course
        </Button>
        <Button style={{backgroundColor: '#2C54A7', color: 'white'}} fontSize={'sm'}>
          Create User (manually)
        </Button>
      </HStack>
    </>

  )
}


export default AdminPage;