import {
  Button, HStack, Input,
  useDisclosure
} from '@chakra-ui/react'
import {useState, useEffect} from "react";
import axios from "axios";
import { Temporal } from '@js-temporal/polyfill';
import FeedbackSurvey from "./FeedbackSurvey";

const ChatBoxFooter = ({
  messages, 
  updateMessages, 
  inConvo, 
  updateIsConvo, 
  currConvoID, 
  updateConvoID
}) => {

  const { isOpenFeedback, onOpenFeedback, onCloseFeedback } = useDisclosure();
  const [sliderVal, setSliderVal] = useState(0);
  const [showTooltip, setSliderTooltip] = useState(false);
  const [text, setText] = useState("");
  useEffect(() => console.log(messages), [messages])

  return(
   <HStack bgColor={'white'} p={5} paddingX={"3vw"} borderTop={'2px solid #EAEAEA'}>
    <Button colorScheme={'green'} fontSize={'sm'} onClick={() => {
      if(inConvo){
        console.log("You're already in a conversation!")
      }else{
        console.log("Started a conversation!")
        axios.post("http://localhost:8000/api/conversation", {"user_id": "testuser1", "semester": "2022F"})
        .then(
          (response) => {
            updateConvoID(response.data.conversation_id);
            updateIsConvo(true);
            console.log(currConvoID, inConvo);
          }
        )
        .catch((err) => {console.log(err)})        
      }
    }}>
      Start Conversation
    </Button>
    <Button colorScheme={'red'} fontSize={'sm'} onClick={() => {
      if(inConvo){
        updateConvoID("");
        updateIsConvo(false);
        onOpenFeedback();
      }else{
        console.log("Must be in a convo to leave one :>")
      }
    }}>
      End chat
    </Button>
     <FeedbackSurvey isOpen={isOpenFeedback} onClose={onCloseFeedback}/>
     <Input variant={'filled'} placeholder={"Enter your message here"} onChange={(e) => {
       setText(e.target.value.slice(0, 250))
     }}/>

     <Button backgroundColor={"#3278cd"} colorScheme={'blue'} fontSize={'sm'} onClick={() => {
      if(inConvo){
        const now = Temporal.Now.zonedDateTimeISO().toString();
        const temp1 = {
          message: text,
          dateSent: now,
          isUser: "true"
          }
         // Load user message on click
        updateMessages((oldMessage) => [...oldMessage, temp1])
         axios.post("http://localhost:8000/api/chatlog", { conversation_id: currConvoID, chatlog: text, 
         time: now 
        })
            .then((response) => {
              const temp2 = {
                message: response.data.agent.chatlog,
                dateSent: response.data.agent.timeSent,
                isUser: "false"
                }
              updateMessages((oldMessage) => [...oldMessage, temp2])
            })
            .catch((err) => console.log(err))
      }else{
        console.log("must start a conversation to send a message to AI!")
      }
    }}>
       Send
     </Button>
  </HStack>
 )
}

export default ChatBoxFooter;