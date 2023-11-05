import Text from '@mui/material/Typography';
import { useEffect } from 'react';
import axios from 'axios';

const ReflectionCompletion = ({ UTORid, isNewUser, setIsNewUser }) => {

  const DEPLOYMENT_ID = "fd582a39-2eed-42ee-b6fd-1b3c430e30cd"
  const markReflectionComplete = () => {
    axios.get(process.env.REACT_APP_API_URL + `/user/survey-complete`, 
      { params: { utorid: UTORid, deployment_id: DEPLOYMENT_ID }})
      .then((res) => {
        // console.log(res);
        setIsNewUser(false);
      }).catch((err) => {
        console.log(err);
      })
  }

  useEffect(() => {localStorage.setItem("qta_stepId", 5);}, []);
  useEffect(() => {if (isNewUser === true) { markReflectionComplete(); }}, [isNewUser]);


  return (
        <div className="h-100 d-flex justify-content-center align-items-center">
          <Text as="h1" style={{ fontFamily: "Poppins", fontWeight: 500, fontSize: "28px", }}>
            Thank you for completing the reflection survey!
          </Text>
        </div>
      )
}

export default ReflectionCompletion;