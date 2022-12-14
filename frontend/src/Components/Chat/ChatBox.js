import {VStack} from "@chakra-ui/react";
import ChatBubble from "./ChatBubble";
import {useRef, useEffect} from "react";



const ChatBox = ({messages, waitingForResp}) => {
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    console.log(messages);
  }, [messages])

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
        
      ))
      }
      {waitingForResp ?
        <div className="typing">
          <span className="circle scaling"></span>
          <span className="circle scaling"></span>
          <span className="circle scaling"></span>
        </div>
       : null}
      <div ref={messagesEndRef}/>
    </VStack>
  );

}

export default ChatBox