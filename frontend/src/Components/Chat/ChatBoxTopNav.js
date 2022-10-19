import {Avatar, AvatarBadge, Button, HStack, Spacer, Text, VStack} from "@chakra-ui/react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faBug, faDownload} from "@fortawesome/free-solid-svg-icons";

const ChatBoxTopNav = (props) => {
  return (<HStack paddingY={"4vh"} paddingX={"4vw"}>
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

    <Button variant={'ghost'}>
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
  </HStack>);
}

export default ChatBoxTopNav;