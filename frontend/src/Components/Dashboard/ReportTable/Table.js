import { Box, Tbody, Tfoot } from "@chakra-ui/react";



const Table = () => {
    
    return(
        <Box borderRadius={"md"}>
            <Text>Reported Conversations (Detailed)</Text>
            <Table variant="simple">
                <THead>
                    <Tr>
                        <Th isNumeric>UID</Th>
                        <Th>REASON</Th>
                        <Th>REPLY</Th>
                    </Tr>
                </THead>
                <Tbody>
                    {/* FETCH RESOURCE FROM POST REQUEST, WRAP INTO A NEW TR */}
                </Tbody>
            </Table>
        </Box>
    )
};


export default Table;