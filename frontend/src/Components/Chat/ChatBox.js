import {VStack} from "@chakra-ui/react";
import ChatBubble from "./ChatBubble";
import {useRef, useEffect} from "react";



const ChatBox = ({messages}) => {
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages])

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

      <div ref={messagesEndRef}/>
    </VStack>
  );

}

export default ChatBox