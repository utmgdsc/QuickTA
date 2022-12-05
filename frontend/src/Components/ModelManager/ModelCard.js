import { 
    Box, 
    Text, 
    Spacer,
    Flex,
    useDisclosure,
} from "@chakra-ui/react"
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faTrash, faPenToSquare, faCheck} from "@fortawesome/free-solid-svg-icons";

const ModelCard = ({modelName, courseid, modelid, prompt}) => {
    const { isOpen, onOpen, onClose} = useDisclosure();

    return (
        <Box w='25%' boxSizing='border-box' p='10px'>
            <Box borderBottom='2px' pb='5px'>
                <Flex>
                        <Text size='lg' fontWeight='500'>{modelName}</Text>
                        <Spacer />
                        <Box>
                            <Flex>
                                <Box w='25px'><FontAwesomeIcon icon={faTrash} size={"lg"}/></Box>
                                <Box w='25px'><FontAwesomeIcon icon={faPenToSquare} size={"lg"} onClick = {onOpen}/></Box>
                                <Box w='25px'><FontAwesomeIcon icon={faCheck} size={"lg"}/></Box>
                            </Flex>
                        </Box>
                </Flex>
            </Box>
        </Box>
    );
}

export default ModelCard;