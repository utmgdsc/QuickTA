import { Box, Text, VStack } from "@chakra-ui/react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { a11yDark } from "react-syntax-highlighter/dist/esm/styles/hljs";

const ChatBubble = ({
  index,
  length,
  message,
  dateSent,
  isUser,
  language,
  isCode,
}) => {
  const isMe = isUser === "true";
  const alignment = isMe ? "flex-end" : "flex-start";
  const bottomRightRadius = isMe ? 0 : 22;
  const bottomLeftRadius = isMe ? 22 : 0;

  let cleanedDateString = dateSent;
  if (dateSent) {
    // Extract the date and time portions of the string
    const date = dateSent.substring(0, 10);
    const time = dateSent.substring(11, 19);

    // Remove any unwanted characters from the date and time strings
    const cleanDate = date.replace(/-/g, "/");
    const cleanTime = time.replace(/\./g, ":");

    // Combine the cleaned date and time strings
    cleanedDateString = `${cleanDate} ${cleanTime}`;
  }

  return (
    <VStack mt={7} alignItems={alignment} alignSelf={alignment} px={5}>
      <Box
        bg={isMe ? "#6892E8" : "#E2E2E2"}
        color={isMe ? "white" : "#212226"}
        px={5}
        py={2.5}
        borderTopLeftRadius={22}
        borderTopRightRadius={22}
        borderBottomLeftRadius={bottomLeftRadius}
        borderBottomRightRadius={bottomRightRadius}
        style={{
          wordWrap: "break-word",
          overflowWrap: "break-word",
          maxWidth: "80%", // Adjust as needed
          whiteSpace: "pre-wrap",
          fontSize: "12px",
        }}
      >
        {isCode ? (
          <div style={{ maxWidth: "100%", overflowX: "auto" }}>
            <SyntaxHighlighter
              showLineNumbers={true}
              // wrapLongLines={true}
              language={language}
              codeTagProps={{ style: { fontSize: "10px" } }}
              customStyle={{
                fontSize: "10px",
                padding: "0px",
                paddingTop: "10px",
                paddingBottom: "10px",
                margin: "0px",
                lineHeight: "1.6",
                minWidth: "600px",
              }}
            >
              {message}
            </SyntaxHighlighter>
          </div>
        ) : (
          <span
            style={{
              wordWrap: "break-word",
              wordBreak: "break-word",
            }}
          >
            {message}
          </span>
        )}
      </Box>
      {index === length - 1 && (
        <Text fontSize={"2xs"} color={"gray"} style={{ userSelect: "none" }}>
          {cleanedDateString}
        </Text>
      )}
    </VStack>
  );
};

export default ChatBubble;
