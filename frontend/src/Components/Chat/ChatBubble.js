import {Box, Text, VStack} from "@chakra-ui/react";



const ChatBubble = ({message, dateSent, isUser}) => {
  const isMe = isUser === "true";
  const alignment = isMe ? "flex-end" : "flex-start";
  const bottomRightRadius = isMe ? 0 : 22;
  const bottomLeftRadius = isMe ? 22 : 0;

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
      <Text fontSize={"2xs"} color={'gray'}>
        {dateSent}
      </Text>
    </VStack>
  )

}


export default ChatBubble;