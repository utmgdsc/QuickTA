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
import { CircularProgress } from "@mui/material";

const ReportTable = ({ course_ID }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const cardStyle = {
    backgroundColor: "white",
    boxShadow: "1px 2px 3px 1px rgba(0,0,0,0.12)",
    borderRadius: "15px",
    padding: "5px 15px 15px 20px",
    width: "100%",
  };

  const titleStyle = {
    fontSize: "16x",
    lineHeight: "24px",
    fontWeight: "700",
  };

  const [reportList, changeReportList] = useState([]);
  const [rowIndex, setRowIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
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
          `/researchers/reported-conversations?course_id=${course_ID}&filter=${"All"}&timezone=America/Toronto`
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

  const parseTime = (time) => {
    let date = new Date(time);
    let parsedDate = date.toLocaleString().replace(",", "");
    return parsedDate;
  };

  useEffect(() => {
    if (course_ID.length !== 0) {
      fetchReports();
    }
  }, [course_ID]);

  return (
    <div className="mt-3">
      <Box style={cardStyle}>
        <Box className="mt-3">
          <span style={titleStyle}>Reported Conversations (Detailed)</span>
        </Box>
        <TableContainer className="mb-2">
          <Table variant="unstyled" overflowX={"scroll"}>
            <Thead>
              <Tr>
                <Th className="reported-conversation-th" style={{ width: '5%'}}>Conversation ID</Th>
                <Th className="reported-conversation-th" style={{ width: '5%'}}>User ID</Th>
                <Th className="reported-conversation-th" style={{ width: '10%'}}>Report Time</Th>
                <Th className="reported-conversation-th" style={{ width: "70%"}}>Report Message</Th>
              </Tr>
            </Thead>
            <Tbody>
              {reportList && reportList.map((obj, index) => (
                // create a new entry in the table by unwrapping the corresponding fields
                // If any table row is clicked on open a modal showing a detailed view of convo
                // <Tooltip label={"Click an entry for more info"}>
                  <Tr
                    key={index}
                    className="reported-conversation-tr"
                    onClick={() => {
                      setRowIndex(index);
                      // console.log(index, reportList);
                      onOpen();
                    }}
                  >
                   <Td className="border px-2">{obj.conversation_id.slice(0,8)}-*** </Td>
                    <Td className="border px-2">{obj.user_id.slice(0,8)}-***</Td>
                    <Td className="border px-2">{parseTime(obj.time)}</Td>
                    <Td className="border px-2">{obj.msg}</Td>
                  </Tr>
                // </Tooltip>
              ))}
            </Tbody>
          </Table>
        </TableContainer>
        {isLoading ? 
          <VStack className="h-100">
            <Center> <CircularProgress /> </Center>
          </VStack>
        : reportList.length !== 0 ? (
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
