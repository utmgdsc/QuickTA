import {Box, Text, VStack} from "@chakra-ui/react";



const ChatBubble = ({message, dateSent, isUser}) => {
  const isMe = isUser === "true";
  const alignment = isMe ? "flex-end" : "flex-start";
  const bottomRightRadius = isMe ? 0 : 22;
  const bottomLeftRadius = isMe ? 22 : 0;

  let cleanedDateString = dateSent;
  if (dateSent) {
    // Extract the date and time portions of the string
    const date = dateSent.substring(0, 10);
    const time = dateSent.substring(11, 19);

    // Remove any unwanted characters from the date and time strings
    const cleanDate = date.replace(/-/g, '/');
    const cleanTime = time.replace(/\./g, ':');

    // Combine the cleaned date and time strings
    cleanedDateString = `${cleanDate} ${cleanTime}`;
  }


  return(
    <VStack mt={7} alignItems={alignment} alignSelf={alignment} px={5}>
      <Box
        bg={isMe ? "#6892E8" : "#E2E2E2"}
        color={isMe ? "white" : "#212226"}
        px={5}
        py={4}
        borderTopLeftRadius={22}
        borderTopRightRadius={22}
        borderBottomLeftRadius={bottomLeftRadius}
        borderBottomRightRadius={bottomRightRadius}
      >
        {message}
      </Box>
      <Text 
        fontSize={"2xs"} 
        color={'gray'} 
        // style={{ userSelect: 'none' }}
        >
        {cleanedDateString}
      </Text>
    </VStack>
  )

}


export default ChatBubble;