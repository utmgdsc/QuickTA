import {Box, Flex, HStack, Input, Text, VStack} from "@chakra-ui/react";



const ChatBubble = ({message, dateSent, isUser}) => {
  const isMe = isUser === "true";
  const alignment = isMe ? "flex-end" : "flex-start";
  const bottomRightRadius = isMe ? 0 : 32;
  const bottomLeftRadius = isMe ? 32 : 0;

  return(
    <VStack mt={7} alignItems={alignment} alignSelf={alignment} px={5}>
      <Box
        bg={isMe ? "blue.50" : "gray.200"}
        px={5}
        py={4}
        borderTopLeftRadius={30}
        borderTopRightRadius={30}
        boderBottomLeftRadius={bottomLeftRadius}
        borderBottomRightRadius={bottomRightRadius}
      >
        {message}
      </Box>
      <Text fontSize={"xs"} color={'gray'}>
        {dateSent}
      </Text>
    </VStack>
  )

}


export default ChatBubble;