import { 
    Box, 
    Heading, 
    Text, 
} from "@chakra-ui/react"

const ModelHeader = ({courseCode, courseName}) => {
    return (
        <Box>
            {/* Header */}
            <Box mt={3}>
                <p style={{ color: '#2C54A7', lineHeight:'27px', fontSize: '30px', fontWeight: 700, fontFamily: "Poppins" }} mt={5}>{courseCode}: {courseName}</p>
                <Text size='lg'>Model Manager</Text>
            </Box>
        </Box>
    );
}

export default ModelHeader;