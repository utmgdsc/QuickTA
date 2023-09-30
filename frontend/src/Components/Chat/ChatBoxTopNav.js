import {
  Avatar,
  AvatarBadge,
  Button,
  HStack,
  Spacer,
  Text,
  VStack,
  Heading,
  Modal,
  useDisclosure,
  ModalOverlay,
  ModalContent,
  ModalCloseButton,
  Textarea,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Tooltip,
} from "@chakra-ui/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBug, faDownload } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import { useState } from "react";
import { IconButton } from "@chakra-ui/react";
import { HamburgerIcon } from "@chakra-ui/icons";
import ErrorDrawer from "../ErrorDrawer";

const ChatBoxTopNav = ({
  courseCode,
  currConvoID,
  openConvoHistory,
  setOpenConvoHistory,
}) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const fileDownload = require("js-file-download");
  const [reportMsg, setReportMsg] = useState("");
  const {
    isOpen: isErrOpen,
    onOpen: onErrOpen,
    onClose: onErrClose,
  } = useDisclosure();
  const [error, setError] = useState();
  return (
    <>
      <HStack
        paddingY={"2vh"}
        paddingX={"2vw"}
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          width: "100%",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          {/* Hamburger icon for smaller screens */}
          {!openConvoHistory && (
            <div className="hamburger-icon">
              <IconButton
                border={"1px solid #EAEAEA"}
                aria-label="Open Conversation History Menu"
                size="sm"
                icon={<HamburgerIcon />}
                onClick={() => {
                  setOpenConvoHistory(true);
                }}
                style={{
                  marginRight: "12px",
                }}
              />
            </div>
          )}
          <Avatar>
            <AvatarBadge boxSize={"1em"} bg={"green.300"} />
          </Avatar>
          <Text>
            <Text
              style={{
                fontSize: "lg",
                marginLeft: "0.5vw",
              }}
            >
              Automated teaching assistant for
            </Text>
            <Heading
              as="h2"
              size="lg"
              style={{
                color: "#012E8A",
                marginLeft: "0.5vw",
                lineHeight: "0.9",
              }}
            >
              {courseCode}
            </Heading>
          </Text>
        </div>

        <div
          className={`chatbox-topnav-buttons`}
          style={{
            display: "flex",
            alignItems: "center",
            maxWidth: "120px",
          }}
        >
          <Button
            variant={"ghost"}
            py={8}
            px={5}
            className="top-nav-button"
            onClick={() => {
              if (currConvoID) {
                axios
                  .post(
                    process.env.REACT_APP_API_URL +
                      `/student/conversation/history/csv?conversation_id=${currConvoID}`,
                    { conversation_id: currConvoID }
                  )
                  .then((response) => {
                    if (response.headers["content-disposition"]) {
                      fileDownload(
                        response.data,
                        response.headers["content-disposition"].split('"')[1]
                      );
                    }
                  })
                  .catch((err) => {
                    setError(err);
                    console.log(err);
                    onErrOpen();
                  });
              } else {
                console.log(
                  "Must be in a conversation to download the chatlog!"
                );
              }
            }}
          >
            <Tooltip label={"This may take a couple of minutes"}>
              <VStack>
                <FontAwesomeIcon icon={faDownload} size={"xl"} />
                <div className="top-nav-buttons-text">
                  <Text fontSize="2xs" style={{ whiteSpace: "wrap" }}>
                    Download Conversation
                  </Text>
                </div>
              </VStack>
            </Tooltip>
          </Button>

          <Button
            variant={"ghost"}
            py={8}
            px={5}
            onClick={() => {
              if (currConvoID) {
                onOpen();
              } else {
                console.log("Must be in a chat to report a conversation!");
              }
            }}
          >
            <Tooltip label={"See a bug?"}>
              <VStack>
                <FontAwesomeIcon icon={faBug} size={"xl"} />
                <div className="top-nav-buttons-text">
                  <Text fontSize="2xs">Report</Text>
                </div>
              </VStack>
            </Tooltip>
          </Button>
        </div>

        <Modal isOpen={isOpen} onClose={onClose}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Report Bug</ModalHeader>
            <ModalCloseButton />

            <ModalBody>
              <Textarea
                placeholder={
                  "Please try your best to describe the problem you encountered!"
                }
                minBlockSize={"300px"}
                onChange={(e) => setReportMsg(e.target.value)}
              />
            </ModalBody>

            <ModalFooter>
              <Button
                style={{ marginRight: "8px" }}
                colorScheme={"gray"}
                onClick={onClose}
              >
                Close
              </Button>
              <Button
                colorScheme={"red"}
                onClick={() => {
                  if (reportMsg) {
                    axios
                      .post(process.env.REACT_APP_API_URL + "/student/report", {
                        conversation_id: currConvoID,
                        msg: reportMsg,
                      })
                      .then((res) => console.log("Reported!"))
                      .catch((err) => {
                        setError(err);
                        console.log(err);
                        onErrOpen();
                      });
                    onClose();
                  }
                }}
              >
                Report
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </HStack>
      <ErrorDrawer error={error} isOpen={isErrOpen} onClose={onErrClose} />
    </>
  );
};

export default ChatBoxTopNav;
