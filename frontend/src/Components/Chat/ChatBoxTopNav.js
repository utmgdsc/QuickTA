import {Avatar, AvatarBadge, Button, HStack, Spacer, Text, VStack, Heading} from "@chakra-ui/react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faBug, faDownload} from "@fortawesome/free-solid-svg-icons";
import axios from "axios";

const ChatBoxTopNav = (props) => {
  const fileDownload = require('js-file-download');
  return (
    <HStack paddingY={"4vh"} paddingX={"4vw"}>
    <Avatar>
      <AvatarBadge boxSize={'1em'} bg={'green.300'}/>
    </Avatar>
    <Text>
      <Text style={{
        fontSize: "lg",
        marginLeft: "0.5vw",
      }}>Automated teaching assistant for</Text>
      <Heading as='h2' size="lg" style={{color: "#012E8A", marginLeft: "0.5vw", lineHeight: "0.9"}}>{props.courseCode}</Heading>
    </Text>
    <Spacer/>

    <Button variant={'ghost'} onClick={() => {
      axios.post('http://localhost:8000/api/report', {conversation_id: "1"})
        .then((response) => {
          if(response.headers['content-disposition']){
            fileDownload(response.data, response.headers['content-disposition'].split('"')[1]);
          }
        })
        .catch((err) => console.log(err))
    }
    }>
      <VStack>
        <FontAwesomeIcon icon={faDownload} size={'2x'}/>
        <Text fontSize="2xs">Download</Text>
      </VStack>
    </Button>

    <Button variant={'ghost'} py={8} px={5}>
      <VStack>
        <FontAwesomeIcon icon={faBug} size={'2x'}/>
        <Text fontSize="2xs">Report</Text>
      </VStack>

    </Button>
  </HStack>
  );
}

export default ChatBoxTopNav;