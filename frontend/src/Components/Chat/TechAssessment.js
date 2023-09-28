import {
  Box,
  Button, HStack, Modal, ModalBody, ModalContent, ModalFooter,
  ModalHeader,
  ModalOverlay, Radio, RadioGroup,
  Textarea, useDisclosure, VStack,
} from '@chakra-ui/react';
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import React, {useState} from "react";
import axios from "axios";
import ErrorDrawer from "../ErrorDrawer";

const TechAssessment = ({ isOpen, onClose, conversation_id, updateConvoID, updateInConvo, updateMessages, UTORid }) => {

  const {isOpen: isErrOpen, onOpen: onErrOpen, onClose: onErrClose} = useDisclosure();
  const {isOpen: isPostQOpen, onOpen: onPostQOpen, onClose: onPostQClose} = useDisclosure();
  const [error, setError] = useState();
  const [code, setCode] = useState("");
  const [options, setOptions] = useState([]);
  const [studentResponse, setStudentResponse] = useState(null);
  const [answer, setAnswer] = useState(null);

  // Fetch code, questions, and answer for tech assessment
  const fetchCodeQuestion = () => {
    axios.get()
        .then((res) => {

        })
        .catch((err) => {
          setError(err);
          onErrOpen();
        })
  }
  const boilerplate = `
      // Recursive function to calculate the factorial of a number
      function factorial(n) {
          if (n === 0) {
              return 1;
          } else {
              return n * factorial(n - 1);
          }
      }
      
      // Input: Enter a number to calculate its factorial
      const num = parseInt(prompt("Enter a number:"));
      
      // Check if the input is non-negative
      if (num < 0) {
          console.log("Factorial is not defined for negative numbers.");
      } else {
          const result = factorial(num);
          console.log(\`The factorial of \${num} is \${result}\`);
      }
      `;

  return (
    <>
    <Modal closeOnOverlayClick={false} isOpen={isOpen} onClose={onClose}>
      <ModalOverlay/>
      <ModalContent>
        <ModalHeader>
          <span style={{
            fontFamily: "Poppins"
          }}>Technical Assessment
        </span>
        </ModalHeader>
        <ModalBody>
          <VStack>
            <Box width={'100%'} m={5} p={3}>
              <SyntaxHighlighter
                showLineNumbers={true}
                wrapLongLines={true}
                language={"python"}
                codeTagProps={{ style: { fontSize: "12px" } }}
              >
                {boilerplate}
              </SyntaxHighlighter>
            </Box>
            <RadioGroup
            display="grid"
            gridTemplateColumns="repeat(2, 1fr)"
            gridGap={4}>
              {options.map((element) => (<Radio value={element.value} onClick={(e) => {
                setStudentResponse(parseInt(e.target.value));
                console.log(`Selected ${studentResponse}`);
              }}>{element}</Radio>))}
            </RadioGroup>
          </VStack>
        </ModalBody>

        <ModalFooter
          style={{
            display: "flex",
          }}
        >
        <Button
        onClick={() => {
          if(studentResponse === null){
            // Do nothing if no choice is selected yet
            console.log("Please select a choice before proceeding");
          }else{
            if(studentResponse == answer){
              console.log("correct");
            }else{
              console.log("incorrect");
            }onPostQOpen();
          }
        }}>
          Next
        </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
    <PostQuestions/>
    <ErrorDrawer error={error} isOpen={isErrOpen} onClose={onErrClose}/>
  </>
  )
}

export default TechAssessment;