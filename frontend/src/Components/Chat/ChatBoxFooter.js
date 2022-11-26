import {
  Button, HStack, Input,
  useDisclosure
} from '@chakra-ui/react'
import {useState, useEffect} from "react";
import axios from "axios";
import { Temporal } from '@js-temporal/polyfill';
import FeedbackSurvey from "./FeedbackSurvey";

const ChatBoxFooter = ({
    updateMessages, 
    inConvo, 
    updateInConvo,
    currConvoID, 
    updateConvoID,
    course_ID
  }) => {

    const { isOpen: isOpenFeedback, onOpen: onOpenFeedback, onClose: onCloseFeedback } = useDisclosure();
    const [sliderVal, setSliderVal] = useState(0);
    const [showTooltip, setSliderTooltip] = useState(false);
    const [text, setText] = useState("");


    console.log(currConvoID);

    return(
    <HStack bgColor={'white'} p={5} paddingX={"3vw"} borderTop={'2px solid #EAEAEA'}>
      <Button colorScheme={'green'} fontSize={'sm'} onClick={() => {
        if(inConvo){
          console.log("You're already in a conversation!");
        }else{
          console.log("Started a conversation!")
          axios.post(process.env.REACT_APP_API_URL + "/conversation", {user_id: "76d1c94d-48c2-4b7a-9ec9-1390732d84a0", 
          course_id: course_ID})
          .then(
            (response) => {
              updateConvoID(response.data.conversation_id);
              updateInConvo(true);
            }
          )
          .catch((err) => {console.log(err)})        
        }
      }}>
        Start Conversation
      </Button>
      <Button colorScheme={'red'} fontSize={'sm'} onClick={() => {
        if(inConvo){
          onOpenFeedback();
        }else{
          console.log("Must be in a convo to leave one :>");
        }
      }}>
        End chat
      </Button>
      <FeedbackSurvey isOpen={isOpenFeedback} onClose={onCloseFeedback} conversation_id={currConvoID}
                      updateConvoID={updateConvoID} updateInConvo={updateInConvo} updateMessages={updateMessages}/>
      <Input variant={'filled'} placeholder={"Enter your message here"} onChange={(e) => {
        setText(e.target.value.slice(0, 250));
      }}/>

      <Button backgroundColor={"#3278cd"} colorScheme={'blue'} fontSize={'sm'} onClick={() => {
        if(inConvo){
          if (text){
            const now = Temporal.Now.zonedDateTimeISO().toString();
            const temp1 = {
              message: text,
              dateSent: now,
              isUser: "true"
            }
            // Load user message on click
            updateMessages((oldMessage) => [...oldMessage, temp1])
            axios.post(process.env.REACT_APP_API_URL + "/chatlog", { conversation_id: currConvoID, chatlog: text,
              time: now
            })
              .then((response) => {
                const temp2 = {
                  message: response.data.agent.chatlog,
                  dateSent: response.data.agent.time,
                  isUser: "false"
                }
                updateMessages((oldMessage) => [...oldMessage, temp2]);
              })
              .catch((err) => console.log(err))
          }else{
           console.log("You must type something before asking AI for response :)")
          }
        }else{
          console.log("must start a conversation to send a message to AI!");
        }
      }}>
        Send
      </Button>
    </HStack>
  )
  }

  export default ChatBoxFooter;