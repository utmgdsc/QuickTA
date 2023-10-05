import {
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Table,
  Tbody,
  Td,
  Thead,
  Tr,
  useDisclosure,
} from "@chakra-ui/react";
import axios from "axios";
import React, { useEffect, useState } from "react";
import ErrorDrawer from "../../ErrorDrawer";

const ConversationView = ({ isOpen, onClose, convo_id }) => {
  const [convo, setConvo] = useState([]);
  const fileDownload = require("js-file-download");
  const {
    isOpen: isErrOpen,
    onOpen: onErrOpen,
    onClose: onErrClose,
  } = useDisclosure();
  const [error, setError] = useState();
  const fetchConversation = async (conversation_id) => {
    await axios
      .get(
        process.env.REACT_APP_API_URL +
          `/researchers/reported-chatlogs?conversation_id=${convo_id}`
      )
      .then((res) => {
        setConvo(res.data.conversation);
      })
      .catch((err) => {
        setError(err);
        // console.log(err);
        onErrOpen();
      });
  };

  function parseTime(time) {
    // Create a Date object from the input time string
    const inputDate = new Date(time);

    // Create a DateTimeFormat object with the desired format
    const formatter = new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      timeZoneName: "long",
    });

    // Format the date in the desired format and time zone
    const formattedTime = formatter.formatToParts(inputDate);

    // Extract the relevant parts for the final format
    const year = formattedTime.find((part) => part.type === "year").value;
    const month = formattedTime.find((part) => part.type === "month").value;
    const day = formattedTime.find((part) => part.type === "day").value;
    const hour = formattedTime.find((part) => part.type === "hour").value;
    const minute = formattedTime.find((part) => part.type === "minute").value;
    const second = formattedTime.find((part) => part.type === "second").value;
    const timeZoneName = formattedTime.find(
      (part) => part.type === "timeZoneName"
    ).value;

    // Create the final formatted string
    const formattedString = `${year}-${month}-${day} ${hour}:${minute}:${second} [${timeZoneName}]`;

    return formattedString;
  }
  function parseDelta(delta) {
    if (delta) {
      // Split the input string by empty string and : to extract components
      let components = delta.split(/(\d+\.\d+|\d+|\.\d+)/g);
      components = components.filter((component) => component !== "");
      components = components.filter((component) => component !== ":");

      // Initialize variables to store parsed values
      let days = null;
      let hours = null;
      let minutes = null;
      let seconds = null;

      // Iterate through the components and parse values
      for (let i = components.length - 1; i >= 0; i--) {
        const part = components[i];
        const numericValue = parseFloat(part);

        if (!isNaN(numericValue)) {
          if (seconds === null) {
            seconds = numericValue;
          } else if (minutes === null) {
            minutes = numericValue;
          } else if (hours === null) {
            hours = numericValue;
          } else if (days === null) {
            days = numericValue;
          }
        }
      }

      let dayString = `${days} day${days !== 1 ? "s" : ""}`;
      let hourString = `${hours} hour${hours !== 1 ? "s" : ""}`;
      let minuteString = `${minutes} minute${minutes !== 1 ? "s" : ""}`;
      let secondString = `${seconds.toFixed(2)} seconds`;

      let formattedDelta = "";
      if (days && !isNaN(days)) {
        formattedDelta += dayString;
      }
      if (hours && !isNaN(hours)) {
        formattedDelta += `${hourString} `;
      }
      if (minutes && !isNaN(minutes)) {
        formattedDelta += `${minuteString} `;
      }
      if (seconds && !isNaN(seconds)) {
        formattedDelta += `${secondString} `;
      }
      return formattedDelta;
    }
    return delta;
  }

  useEffect(() => {
    if (convo_id) {
      fetchConversation(convo_id);
    }
  }, [convo_id]);

  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        scrollBehavior={"inside"}
        size="5xl"
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader
            style={{
              fontFamily: "Poppins",
            }}
          >
            Conversation View
          </ModalHeader>
          <ModalBody>
            <Table>
              <Thead>
                <Tr>
                  <Td>From</Td>
                  <Td>Message</Td>
                  <Td>Time</Td>
                  <Td>Delta</Td>
                </Tr>
              </Thead>
              <Tbody>
                {convo.map(({ speaker, chatlog, time, delta }, index) => (
                  <Tr key={index}>
                    <Td>{speaker}</Td>
                    <Td>{chatlog}</Td>
                    <Td>{parseTime(time)}</Td>
                    <Td>{parseDelta(delta)}</Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </ModalBody>
          <ModalFooter>
            <Button
              onClick={async () => {
                await axios
                  .post(
                    process.env.REACT_APP_API_URL +
                      `/researchers/reported-chatlogs-csv?conversation_id=${convo_id}`
                  )
                  .then((res) => {
                    if (res.headers["content-disposition"]) {
                      fileDownload(
                        res.data,
                        res.headers["content-disposition"].split('"')[1]
                      );
                    }
                  })
                  .catch((err) => {
                    setError(err);
                    // console.log(err);
                    onErrOpen();
                  });
              }}
            >
              Download
            </Button>
            <ModalCloseButton>Close</ModalCloseButton>
          </ModalFooter>
        </ModalContent>
      </Modal>
      <ErrorDrawer error={error} isOpen={isErrOpen} onClose={onErrClose} />
    </>
  );
};

export default ConversationView;
