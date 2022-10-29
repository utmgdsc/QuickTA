import {VStack} from "@chakra-ui/react";
import ChatBubble from "./ChatBubble";
import {useState} from "react";



const ChatBox = ({messages}) => {
  return(
    <VStack background={'gray.100'} style={{
      maxHeight: "50vh",
      overflowY: "scroll"
    }}>
      {messages.map(({message, dateSent, isUser}, index) => (
        <ChatBubble
        key={index}
        message={message}
        dateSent={dateSent}
        isUser={isUser}
        />
      ))}
    </VStack>
  );

}

export default ChatBox