import {Button, HStack, Input, Textarea} from '@chakra-ui/react'

const ChatBoxFooter = () =>{
 return(
   <HStack bgColor={'white'} p={5} >
    <Button colorScheme={'red'} fontSize={'sm'}>
      End chat
    </Button>
     <Input variant={'filled'}/>
     <Button colorScheme={'blue'} fontSize={'sm'}>
       Send
     </Button>
  </HStack>
 )
}

export default ChatBoxFooter;