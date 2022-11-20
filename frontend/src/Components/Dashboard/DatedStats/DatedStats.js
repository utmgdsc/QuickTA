import {
    VStack, 
    Flex, 
    Spacer 
} from "@chakra-ui/react";
import StatCard from "./StatCard";
import DatedGraph from "./DatedGraph"
import {useEffect} from "react";
import axios from "axios";
import {useState} from "react";

const DatedStats = ({isWeekly, courseID}) => {

  const [avgRating, setAvgRating] = useState(0);
  const [avgRespTime, setAvgRespTime] = useState(0);
  const [avgComfort, setAvgComfort] = useState(0);
  const [numReport, setNumReport] = useState(0);

  const [avgRatingDelta, setAvgRatingDelta] = useState(0);
  const [avgRespTimeDelta, setAvgRespTimeDelta] = useState(0);
  const [avgComfortDelta, setAvgComfortDelta] = useState(0);
  const [numReportDelta, setNumReportDelta] = useState(0);


  useEffect(() => {
    fetchData("/researcher/average-ratings");
    fetchData("/researcher/avg-comfortability-rating");
    fetchData("/researcher/avg-response-rate");
    fetchData("/researcher/reported-conversations");
  }, [courseID]);

  function computePrevAvg(data){
    // we need to look at avg of indices 0, .. , data-2
    if (data.length == 0){
      return 0;
    }else if(data.length == 1){
      return data[0];
    }else{
      let sum = 0;
      for (let i = 0; i < data.length  - 1; i++){
        sum += data[i];
      }
      return sum / (data.length - 1);
    }
  }

  const fetchData = async (endpoint) => {
      if (endpoint.endsWith("average-ratings")){
        return await axios.post(process.env.REACT_APP_API_URL + (isWeekly === 1 ? "" : "") + endpoint, {course_id: courseID})
          .then((res) => {
            setAvgRating(res.data.avg_ratings)
            setAvgRatingDelta(res.data.avg_ratings - computePrevAvg(res.data.all_ratings));
          })
          .catch((err) => {console.log(err)})
      }
      if (endpoint.endsWith("avg-comfortability-rating")){
        return await axios.post(process.env.REACT_APP_API_URL + (isWeekly === 1 ? "" : "") + endpoint, {course_id: courseID})
          .then((res) => {
            setAvgComfort(res.data.avg_comfortability_rating)
            setAvgComfortDelta(res.data.avg_comfortability_rating - computePrevAvg(res.data.comfortability_ratings));
          })
          .catch((err) => {console.log(err)})
      }if (endpoint.endsWith("avg-response-rate")){
        return await axios.post(process.env.REACT_APP_API_URL + (isWeekly === 1 ? "" : "") + endpoint, {course_id: courseID})
          .then((res) => {
            setAvgRespTime(res.data.avg_response_rate)
            setAvgRespTimeDelta(res.data.avg_response_rate - computePrevAvg(res.data.all_response_rates));
          })
          .catch((err) => {console.log(err)})
      }
      if (endpoint.endsWith("reported-conversations")){
        return await axios.post(process.env.REACT_APP_API_URL + (isWeekly === 1 ? "" : "") + endpoint, {course_id: courseID})
          .then((res) => {
            setNumReport(res.data.total_reported);
          })
          .catch((err) => {console.log(err)})
      }
  }
    return (
        <Flex flexWrap='wrap'>
            <VStack minWidth='320px' w='22vw' spacing='20px'>
                <StatCard title={"Average Rating"} num={avgRating} delta={avgRatingDelta} unit={"☆"}/>
                <StatCard title={"Average Response Rate"} num={avgRespTime} delta={avgRespTimeDelta} unit={"s"}/>
                <StatCard title={"Average Course Comfortability Rating"} num={avgComfort} delta={avgComfortDelta} unit={"☆"}/>
                <StatCard title={"Reported Conversations"} num={numReport} delta={0} unit={""}/>
            </VStack>
            <Spacer/>
            {/*<DatedGraph isWeekly={{isWeekly, courseID}}/>*/}
        </Flex>
    );
}

export default DatedStats;