import { 
    Box, 
    Heading, 
    Text, 
    HStack,
    Button, 
    ModalHeader
} from "@chakra-ui/react"
import TopNav from "../Components/TopNav";
import ModelHeader from "../Components/ModelManager/ModelHeader"
import ModelBody from "../Components/ModelManager/ModelBody"


const ResearcherModels = ({UTORid, courseCode, courseName, courseid}) => {
    return (
        <div style={{
            backgroundColor: "#F1F1F1",
            width: "100vw",
            height: '100vh'
          }}>
            <TopNav UTORid={UTORid}/>
            <Box ml={'12vw'} mr={'12vw'}>
                <ModelHeader courseCode={"CSC108"} courseName={"Introduction to Computer Programming"}/>
                <ModelBody />
            </Box>
        </div>
    );
};

export default ResearcherModels;