import {VStack} from "@chakra-ui/react";
import ChatBubble from "./ChatBubble";

const messages = [
  {
    message: "Hello! I’m an automated TA for CSC108H5F. How may I help you?",
    dateSent: "Jan 12, 2022",
    from: "agent"
  },

  {
    message: "When is A1 due?",
    dateSent: "Jan 12, 2022",
    from: "user"
  },

  {
    message: "A1 is due on 08/15/2022. I hope that helps! Do you have any other questions?",
    dateSent: "Jan 12, 2022",
    from: "agent"
  },

  {
    message: "I want practice problems about dictionaries",
    dateSent: "Jan 12, 2022",
    from: "user"
  },

  {
    message: "You can find practice problems on PeerWise!\n" +
      "https://peerwise.cs.auckland.ac.nz/\n" +
      "Is there anything else I can help you with?",
    dateSent: "Jan 12, 2022",
    from: "agent"
  }
]

const ChatBox = (props) => {
  return(
    <VStack background={'gray.100'} style={{
      maxHeight: "50vh",
      overflowY: "scroll"
    }}>
      {messages.map(({message, dateSent, from}, index) => (
        <ChatBubble
        key={index}
        message={message}
        dateSent={dateSent}
        from={from}
        />
      ))}
    </VStack>
  );

}

export default ChatBox