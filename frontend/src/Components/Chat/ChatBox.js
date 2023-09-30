import { VStack } from "@chakra-ui/react";
import ChatBubble from "./ChatBubble";
import { useRef, useEffect } from "react";

const ChatBox = ({ messages, waitingForResp }) => {
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <VStack
      background={"#F9F9F9"}
      style={{
        height: "53.5vh",
        overflowY: "scroll",
        padding: "0vw 1.5vw 0vw 1.5vw",
        overflowWrap: "break-word",
      }}
    >
      {messages.map(({ message, dateSent, isUser }, index) => {
        // Split the message into paragraphs based on "\n\n1.", "\n\n2.", etc.
        const paragraphs = message.split(/\n\n/);
        if (index == messages.length - 1) {
          console.log(paragraphs);
        }
        const chatBubbles = [];

        paragraphs.forEach((paragraph, paragraphIndex) => {
          if (paragraph.startsWith("```")) {
            // Parse out ```
            paragraph = paragraph.substring(3, paragraph.length - 3);
            paragraph = paragraph.trim();

            chatBubbles.push(
              <ChatBubble
                key={`${index}-${paragraphIndex}`}
                index={paragraphIndex}
                length={paragraphs.length}
                message={paragraph}
                dateSent={dateSent}
                isUser={isUser}
                language={"python"}
                isCode={true}
              />
            );
          } else {
            chatBubbles.push(
              <ChatBubble
                key={`${index}-${paragraphIndex}`}
                index={paragraphIndex}
                length={paragraphs.length}
                message={paragraph}
                dateSent={dateSent}
                isUser={isUser}
              />
            );
          }
        });

        return chatBubbles;
      })}

      {waitingForResp ? (
        <div className="typing">
          <div className="dot-flashing"></div>
        </div>
      ) : null}
      <div ref={messagesEndRef} />
    </VStack>
  );
};

export default ChatBox;
