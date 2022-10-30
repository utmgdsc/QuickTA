import {Avatar, AvatarBadge, Button, HStack, Spacer, Text, VStack, Heading} from "@chakra-ui/react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faBug, faDownload} from "@fortawesome/free-solid-svg-icons";

const ChatBoxTopNav = (props) => {
  return (
  <HStack paddingY={"4vh"} paddingX={"3vw"} borderBottom={'2px solid #EAEAEA'}>
    <Avatar size="lg">
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

    <Button variant={'ghost'} py={8} px={4}>
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
  </HStack>);
}

export default ChatBoxTopNav;