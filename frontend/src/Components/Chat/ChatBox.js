import {VStack} from "@chakra-ui/react";
import ChatBubble from "./ChatBubble";
import {useState} from "react";



const ChatBox = ({messages}) => {
  return(
    <VStack background={'#F9F9F9'} style={{
      height: "50vh",
      overflowY: "scroll",
      padding: "0vw 1.5vw 0vw 1.5vw"
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