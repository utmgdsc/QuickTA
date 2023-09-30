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
        const codeRegex = /```(\w+)?\n([\s\S]+?)\n```/g;
        const chatBubbles = [];

        if (paragraphs.length > 1) {
          paragraphs.forEach((paragraph, paragraphIndex) => {
            // Skip empty paragraphs
            if (paragraph.trim().length === 0) return;

            if (paragraph.match(codeRegex)) {
              const matches = paragraph.match(codeRegex);
              let codeSnippet = matches[0];
              const languageRegex = /```(\w+)\n([\s\S]+)\n```/;
              const match = codeSnippet.match(languageRegex);

              let language = match[1];
              let code = match[2];

              chatBubbles.push(
                <ChatBubble
                  key={`${index}-${paragraphIndex}`}
                  index={paragraphIndex}
                  length={paragraphs.length}
                  message={code}
                  dateSent={dateSent}
                  isUser={isUser}
                  language={language}
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
        } else {
          chatBubbles.push(
            <ChatBubble
              key={index}
              index={0}
              length={1}
              message={message}
              dateSent={dateSent}
              isUser={isUser}
            />
          );
        }

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
