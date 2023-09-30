import { Text } from "@chakra-ui/react";
import { useState, useEffect } from "react";
import PreSurvey from "../Components/Chat/PreSurvey";
import { Progress } from "@chakra-ui/react";

const LandingPage = ({ isLoading, UTORid, isNewUser, setIsNewUser }) => {
  useEffect(() => {
    console.log("Landing Page: ", isLoading);
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
          <Progress size="xs" isIndeterminate />
        </div>
      </div>
      <div></div>
    </div>
  );
};

export default LandingPage;
