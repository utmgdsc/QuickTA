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

const ReportTable = () => {
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
                <Tr>
                    <Td>32962087</Td>
                    <Td>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore.</Td>
                    <Td>Reply now</Td>
                </Tr>
                <Tr>
                    <Td>70024852</Td>
                    <Td>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore.</Td>
                    <Td>Reply now</Td>
                </Tr>
                <Tr>
                    <Td>32296408</Td>
                    <Td>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore.</Td>
                    <Td>Reply now</Td>
                </Tr>
                <Tr>
                    <Td>21633508</Td>
                    <Td>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore.</Td>
                    <Td>Reply now</Td>
                </Tr>
                <Tr>
                    <Td>98090402</Td>
                    <Td>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore.</Td>
                    <Td>Reply now</Td>
                </Tr>
                <Tr>
                    <Td>41859055</Td>
                    <Td>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore.</Td>
                    <Td>Reply now</Td>
                </Tr>
                </Tbody>
            </Table>
            </VStack>
            </TableContainer>
        </Box>
    );
}

export default ReportTable;