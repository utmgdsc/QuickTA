import {
  Box,
  Heading,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  VStack,
  useDisclosure,
  Center,
  Tooltip,
} from "@chakra-ui/react";

import axios from "axios";
import React, { useEffect, useState } from "react";
import ConversationView from "./ConversationView";
import ErrorDrawer from "../../ErrorDrawer";

const ReportTable = ({ course_ID, isWeekly, setIsLoading }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [hover, setHover] = useState(false);
  const cardStyle = {
    backgroundColor: "white",
    boxShadow: "1px 2px 3px 1px rgba(0,0,0,0.12)",
    borderRadius: "15px",
    padding: "5px 15px 15px 20px",
    width: "100%",
  };

  const titleStyle = {
    fontSize: "20px",
    lineHeight: "25px",
  };

  const [reportList, changeReportList] = useState([{}]);
  const [rowIndex, setRowIndex] = useState(0);
  const {
    isOpen: isErrOpen,
    onOpen: onErrOpen,
    onClose: onErrClose,
  } = useDisclosure();
  const [error, setError] = useState();

  const fetchReports = async () => {
    return await axios
      .get(
        process.env.REACT_APP_API_URL +
          `/researchers/reported-conversations?course_id=${course_ID}&filter=${
            isWeekly === 1 ? "Weekly" : isWeekly === 0 ? "Monthly" : "All"
          }&timezone=America/Toronto`
      )
      .then((res) => {
        setIsLoading(true);
        let data = res.data;

        changeReportList(data.reports);
        setIsLoading(false);
      })
      .catch((err) => {
        setIsLoading(false);
        setError(err);
        // console.log(err);
        onErrOpen();
      });
  };

  useEffect(() => {
    if (course_ID.length !== 0) {
      fetchReports();
      // console.log(reportList);
    }
  }, [course_ID]);

  return (
    <div>
      <Box style={cardStyle} mt={6}>
        <Heading as="h2">
          <span style={titleStyle}>Reported Conversations (Detailed)</span>
        </Heading>
        <TableContainer>
          <Table variant="unstyled" overflowX={"scroll"}>
            <Thead>
              <Tr>
                <Th>Conversation ID</Th>
                <Th>User ID</Th>
                <Th>Report Time</Th>
                <Th>Report Message</Th>
              </Tr>
            </Thead>
            <Tbody>
              {reportList.map((obj, index) => (
                // create a new entry in the table by unwrapping the corresponding fields
                // If any table row is clicked on open a modal showing a detailed view of convo
                <Tooltip label={"Click an entry for more info"}>
                  <Tr
                    key={index}
                    onClick={() => {
                      setRowIndex(index);
                      // console.log(index, reportList);
                      onOpen();
                    }}
                  >
                    <Td>{obj.conversation_id}</Td>
                    <Td>{obj.user_id}</Td>
                    <Td>{obj.time}</Td>
                    <Td>{obj.msg}</Td>
                  </Tr>
                </Tooltip>
              ))}
            </Tbody>
          </Table>
        </TableContainer>
        {reportList.length !== 0 ? (
          <ConversationView
            isOpen={isOpen}
            onClose={onClose}
            convo_id={reportList[rowIndex].conversation_id}
          />
        ) : (
          <VStack>
            <Center>No reported Conversations!</Center>
          </VStack>
        )}
      </Box>
      <ErrorDrawer error={error} isOpen={isErrOpen} onClose={onErrClose} />
    </div>
  );
};

export default ReportTable;
