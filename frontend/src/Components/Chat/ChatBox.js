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
        const chatBubbles = [];

        var hasCode = false;
        var currentMessage = "";
        var language = "";
        paragraphs.forEach((paragraph, paragraphIndex) => {
          if (paragraph.startsWith("```")) {
            // Parse out ```
            // find \n

            hasCode = true;
            let newline = paragraph.indexOf("\n");
            language = paragraph.substring(3, newline);
            paragraph = paragraph.substring(newline + 1, paragraph.length);
            // paragraph = paragraph.trim();
            currentMessage += paragraph;

            if (paragraph.includes("```")) {
              hasCode = false;
              paragraph = paragraph.substring(0, paragraph.length - 3).trim();
              currentMessage = "";

              chatBubbles.push(
                <ChatBubble
                  key={`${index}-${paragraphIndex}`}
                  index={paragraphIndex}
                  length={paragraphs.length}
                  message={paragraph}
                  dateSent={dateSent}
                  isUser={isUser}
                  language={language}
                  isCode={true}
                />
              );
            }
          } else if (hasCode) {
            //  check if it has backticks
            if (paragraph.includes("```")) {
              hasCode = false;
              paragraph = paragraph.substring(0, paragraph.length - 3);
              // paragraph = paragraph.trim();
            }
            currentMessage += "\n" + paragraph.trim();

            if (!hasCode) {
              chatBubbles.push(
                <ChatBubble
                  key={`${index}-${paragraphIndex}`}
                  index={paragraphIndex}
                  length={paragraphs.length}
                  message={currentMessage}
                  dateSent={dateSent}
                  isUser={isUser}
                  language={language}
                  isCode={true}
                />
              );
              currentMessage = "";
            }
          } else if (paragraph !== "") {
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
