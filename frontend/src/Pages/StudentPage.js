import {Box} from "@chakra-ui/react";
import TopNav from "../Components/TopNav";
import Chat from "../Components/Chat/Chat";

const StudentPage = ({currCourse, setCurrCourse, semester, courses, isLoading, UTORid}) => {

    return (
    <div style={{
        backgroundColor: "#F1F1F1",
        width: "100vw",
        height: '110vh'
      }}>
        <TopNav UTORid={UTORid}/>
        {
          courses.length === 0
          ?  <Box ml={'12vw'} mr={'12vw'}>Sorry, you are not enrolled in any courses!</Box>
            :
            <Chat
              currCourse={currCourse}
              setCurrCourse={setCurrCourse}
              semester={semester}
              courses={courses}
              style={{position: 'relative'}}
            />
        }
    </div>
    );
};


export default StudentPage;