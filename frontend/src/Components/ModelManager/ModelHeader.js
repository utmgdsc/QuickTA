import { 
    Box, 
    Heading, 
    Text, 
} from "@chakra-ui/react"

const ModelHeader = ({courseCode, courseName}) => {
    return (
        <Box>
            <Heading as='h1' size="lg" color='#2C54A7' lineHeight='0.9'>{courseCode}: {courseName}</Heading>
            <Text size='lg'>Model Manager</Text>
        </Box>
    );
}

export default ModelHeader;