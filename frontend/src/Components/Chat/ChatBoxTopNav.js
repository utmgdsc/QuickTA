import {Avatar, AvatarBadge, Button, HStack, Spacer, Text, VStack} from "@chakra-ui/react";
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
        fontSize: "xx-small",
      }}>Automated teaching assistant for</Text>
      <Text color={"#012E8A"}>{props.courseCode}</Text>
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
        <FontAwesomeIcon icon={faDownload} size={'lg'}/>
        <Text fontSize={6}>Download</Text>
      </VStack>
    </Button>

    <Button variant={'ghost'}>
      <VStack>
        <FontAwesomeIcon icon={faBug} size={'lg'}/>
        <Text fontSize={6}>Report</Text>
      </VStack>

    </Button>
  </HStack>
  );
}

export default ChatBoxTopNav;