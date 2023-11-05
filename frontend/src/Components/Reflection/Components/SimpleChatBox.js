import ChatBubble from "../../Chat/ChatBubble";
import { useRef, useEffect, useState } from "react";

const SimpleChatBox = ({ messages, waitingForResponse }) => {
  const messagesEndRef = useRef(null);
  const [initialWait, setInitialWait] = useState(true);
  
  const chatBoxContainerStyle = {
    background: "#F9F9F9",
    height: "70%",
    overflowY: "scroll",
    padding: "0vw 1.5vw 0vw 1.5vw",
    overflowWrap: "break-word",
  }

  // Scroll to bottom of chatbox when new message is sent
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div style={chatBoxContainerStyle}>

      {/* Messages parsing */}
      {/* TODO: code cleanup */}
      {messages.map(({ message, dateSent, isUser }, index) => {
        
        // Split the message into paragraphs based on "\n\n1.", "\n\n2.", etc.
        const chatBubbles = [];
        
        let paragraphs = []
        if (isUser) { paragraphs = message.split(/\n\n/); } 
        else { paragraphs = [message]; }
        
        var hasCode = false;
        var currentMessage = "";
        var language = "";
        
        // For each paragraph, check if it is a code block 
        paragraphs.forEach((paragraph, paragraphIndex) => {
          if (paragraph.startsWith("```")) {

            hasCode = true;
            let newline = paragraph.indexOf("\n");
            language = paragraph.substring(3, newline);
            paragraph = paragraph.substring(newline + 1, paragraph.length);
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

      {waitingForResponse ? (
        <div
          className="typing"
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            width: "100%",
            height: messages.length === 0 ? "100%" : ""
          }}
        >
          <div className="dot-flashing"></div> 
        </div>
      ) : null}
      <div ref={messagesEndRef} />
    </div>
  );
};

export default SimpleChatBox;