import {
    Box, 
    Heading,
    Table,
    Thead,
    Tbody,
    Tfoot,
    Tr,
    Th,
    Td,
    TableCaption,
    TableContainer,
    VStack
} from "@chakra-ui/react";

const ReportTable = ( { course_ID } ) => {
    const cardStyle = {
        backgroundColor: 'white', 
        boxShadow: '1px 2px 3px 1px rgba(0,0,0,0.12)', 
        borderRadius: '15px', 
        padding: '5px 15px 15px 20px',
        width: '99%',
    };

    const titleStyle = {
        fontSize: "20px",
        lineHeight: '25px'
    }

    return (
        
        <Box style={cardStyle}>
            <Heading as='h2'><span style={titleStyle}>Reported Conversations (Detailed)</span></Heading>
            <TableContainer>
            <VStack style= {{
                    height: "40vh",
                    overflowY: "scroll",
                    maxWidth: '99%',
                    overflowX: 'hidden',
                }}>
            <Table variant='unstyled'>
                <Thead>
                <Tr>
                    <Th>UID</Th>
                    <Th>Reason</Th>
                    <Th>Actions</Th>
                </Tr>
                </Thead>
                <Tbody>
                {/*    MAP THE MESSAGES FROM POST REQUEST */}
                </Tbody>
            </Table>
            </VStack>
            </TableContainer>
        </Box>
    );
}

export default ReportTable;