import { 
    Box, 
    FormControl,
    FormLabel,
    Switch,
    Heading, 
    Text, 
    Flex,
    Button,
} from "@chakra-ui/react"
import ModelCreator from "./ModelCreator";

const ModelBody = (courseid) => {
    const cardStyle = {
        backgroundColor: 'white',
        boxShadow: '1px 2px 3px 1px rgba(0,0,0,0.12)',
        borderRadius: '15px',
        padding: '5px 15px 15px 20px',
        maxWidth: '100%',
      };
    
      const titleStyle = {
        fontSize: "20px",
        lineHeight: '25px'
      };

    // make api call to get the model id & models here
    const modelName = "GBT-3";

    return (
        <Box style={cardStyle} mt={5}>
            <Heading as='h2'><span style={titleStyle}>Model Information</span></Heading>
            <Flex>
                <Text><span style={{fontWeight: '500'}}>Current model:</span> {modelName}</Text>
                <FormControl display='flex'  alignItems='center' ml="1em" w={"15%"}>
                    <FormLabel htmlFor='email-alerts' mb='0'>
                        Enable Model:
                    </FormLabel>
                    <Switch id='model-status' />
                </FormControl>
            </Flex>
            <Flex flexWrap="wrap" mt={3} marginLeft='-5px'>
                <Box p='5px'><Button colorScheme='green'>Select</Button></Box>
                <ModelCreator/>
                <Box p='5px'><Button colorScheme='red'>Delete</Button></Box>
            </Flex>
        </Box>
    );
}

export default ModelBody;