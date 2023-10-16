import { Text } from "@chakra-ui/react";
import { useEffect } from "react";
import PreSurvey from "../Components/Chat/PreSurvey";
import { LinearProgress } from "@mui/material";

const LandingPage = ({ isLoading, UTORid, isNewUser, setIsNewUser }) => {
  useEffect(() => {
    // console.log("Landing Page: ", isLoading);
  }, [isLoading]);

  const funFacts = [
    'There\'s a programming language called "LOLCODE" inspired by cat memes.',
    "The first computer mouse was made of wood.",
    "There are hundreds of programming languages, each with unique strengths.",
    '"Bug" in programming comes from a literal moth in a computer.',
    "Programmers hide secret messages, like the Konami Code, in code.",
    '"Spaghetti code" is a term for messy and unorganized programming that\'s hard to follow, like a plate of tangled spaghetti.',
    'The "Hello, World!" program, used to teach beginners, was first created in the C programming language.',
    "Cat images and memes often find their way into code comments.",
    "The HTTP 404 error, indicating a web page not found, was named after Room 404 at CERN, where the World Wide Web was born.",
    'Programmers celebrate "Programmers\' Day" on the 256th day of the year, which is usually September 13th (or September 12th on leap years).',
    "The world record for the fastest typing speed is around 217 words per minute.",
    "Like writer's block, programmers can face \"coder's block\" when struggling to write code.",
    "You can register domain names using emojis, like ❤️.ws.",
    'Emoji Programming Languages: There are programming languages based entirely on emojis, like "😎++."',
    "In the year 2000, there was widespread concern that computer systems wouldn't handle the change from '99 to '00, causing the Y2K bug.",
  ];

  if (!isLoading) {
    return (
      <PreSurvey
        UTORid={UTORid}
        isNewUser={isNewUser}
        setIsNewUser={setIsNewUser}
      />
    );
  }

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        background:
          "background: linear-gradient(90deg, rgba(58,82,180,1) 0%, rgba(29,126,253,1) 52%, rgba(153,204,255,1) 100%)",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          // justifyContent: "center",
          // alignItems: "center",
          maxWidth: "80vw",
        }}
      >
        <Text
          fontSize="5xl"
          as="b"
          color="black"
          style={{ textAlign: "center" }}
        >
          Welcome to QuickTA
        </Text>

        {/* TODO: more fun facts */}
        <div
          style={{
            marginTop: "50px",
          }}
        >
          <Text
            fontSize="sm"
            color="gray"
            style={{
              textAlign: "center",
            }}
          >
            {funFacts[Math.floor(Math.random() * funFacts.length)]}
          </Text>
          {/* <Progress style={{ marginTop: "10px" }} size="xs" isIndeterminate /> */}
          <LinearProgress style={{ marginTop: "10px" }} />
        </div>
      </div>
      <div></div>
    </div>
  );
};

export default LandingPage;
