import ChatBubble from "./ChatBubble";
import { useRef, useEffect, useState } from "react";

/**
 * A component that displays a chat box with chat bubbles for each message.
 * @param {Object[]} messages - An array of message objects to display in the chat box.
 * @param {string} messages[].message - The message text to display.
 * @param {Date} messages[].dateSent - The date the message was sent.
 * @param {boolean} messages[].isUser - Whether the message was sent by the user or not.
 * @param {boolean} waitingForResponse - Whether the chat box is waiting for a response or not.
 */
const ChatBox = ({ messages, waitingForResponse }) => {
  const messagesEndRef = useRef(null);
  const [initialWait, setInitialWait] = useState(true);

  // Scroll to the bottom of the chat box when a new message is added.
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Set initial wait to false when waitingForResponse changes to false.
  useEffect(() => {
    if (waitingForResponse) {
      setInitialWait(false);
    }
  }, [waitingForResponse]);

  

  return (
    <div
      background={"#F9F9F9"}
      style={{
        height: "70%",
        overflowY: "scroll",
        padding: "0vw 1.5vw 0vw 1.5vw",
        overflowWrap: "break-word",
      }}
    >
      {messages.map(({ message, dateSent, isUser }, index) => {
        // Split each message based on the paragraphs based on "\n\n1.", "\n\n2.", etc.
        let paragraphs = [];
        if (isUser) {
          paragraphs = message.split(/\n\n/);
        } else if (message) {
          paragraphs = [message];
        }
        const chatBubbles = [];

        var hasCode = false;
        var currentMessage = "";
        var language = "";
        paragraphs.forEach((paragraph, paragraphIndex) => {

          // Check if it's a code block
          if (paragraph.startsWith("```")) {
            // Parse out ```
            // find \n
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
          } 
          // Check for the end of a code block for cases where there are multiple lines of code
          else if (hasCode) {
            // check if it has backticks
            if (paragraph.includes("```")) {
              hasCode = false;
              paragraph = paragraph.substring(0, paragraph.length - 3);
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
          } 
          // Add chat bubble for non-code block messages
          else if (paragraph !== "") {
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

      {/* Show a typing indicator if waiting for a response */}
      {waitingForResponse || initialWait ? (
        <div
          className="typing"
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            width: "100%",
            height: messages.length === 0 ? "100%" : "",
          }}
        >
          <div className="dot-flashing"></div>
        </div>
      ) : null}
      <div ref={messagesEndRef} />
    </div>
  );
};

export default ChatBox;
