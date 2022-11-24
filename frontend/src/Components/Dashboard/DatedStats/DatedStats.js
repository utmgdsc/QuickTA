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

  useEffect(() => {
    if (courseID.length != 0){
      fetchData("/researcher/average-ratings");
      fetchData("/researcher/avg-comfortability-rating");
      fetchData("/researcher/avg-response-rate");
      fetchData("/researcher/reported-conversations");
    }
  }, [courseID])

  const [avgRating, setAvgRating] = useState({avgRating : 0, avgRatingDelta: 0});
  const [avgRespTime, setAvgRespTime] = useState({avgRespTime: 0, avgRespTimeDelta: 0});
  const [avgComfort, setAvgComfort] = useState({avgComfort: 0, avgComfortDelta: 0});
  const [numReport, setNumReport] = useState({numReport: 0});

  function computePrevAvg(data, currAvg){
    // we need to look at avg of indices 0, .. , data-2
    if (data.length == 0){
      return 0;
    }
    let x = currAvg * data.length;
    x -= data[data.length - 1];
    return Math.round((currAvg - (x / (data.length - 1))) * 100) / 100;
  }

  const fetchData = async (endpoint) => {
      if (endpoint.endsWith("average-ratings")){
        return await axios.post(process.env.REACT_APP_API_URL + endpoint, {filter: (isWeekly === 1 ? "Weekly" : "Monthly"),
          course_id: courseID, timezone: "America/Toronto"})
          .then((res) => {
            setAvgRating({
              avgRating: Math.round(res.data.avg_ratings * 100) / 100,
              avgRatingDelta: computePrevAvg(res.data.all_ratings, res.data.avg_ratings)
            })
          })
          .catch((err) => {console.log(err)})
      }
      
      if (endpoint.endsWith("avg-comfortability-rating")){
        return await axios.post(process.env.REACT_APP_API_URL + endpoint, {filter: (isWeekly === 1 ? "Weekly" : "Monthly"),
          course_id: courseID, timezone: "America/Toronto"})
          .then((res) => {
            setAvgComfort({
              avgComfort: Math.round(res.data.avg_comfortability_rating * 100) / 100,
              avgComfortDelta: computePrevAvg(res.data.comfortability_ratings, res.data.avg_comfortability_rating)
            });
          })
          .catch((err) => {console.log(err)})
      }
      
      if (endpoint.endsWith("avg-response-rate")){
        return await axios.post(process.env.REACT_APP_API_URL + endpoint, {filter: (isWeekly === 1 ? "Weekly" : "Monthly"),
          course_id: courseID, timezone: "America/Toronto"})
          .then((res) => {
            setAvgRespTime({
              avgRespTime: Math.round(res.data.avg_response_rate * 100) / 100,
              avgRespTimeDelta: computePrevAvg(res.data.all_response_rates, res.data.avg_response_rate)
            })
          })
          .catch((err) => {console.log(err)})
      }
      
      if (endpoint.endsWith("reported-conversations")){
        return await axios.post(process.env.REACT_APP_API_URL + endpoint, {filter: (isWeekly === 1 ? "Weekly" : "Monthly"),
          course_id: courseID, timezone: "America/Toronto"})
          .then((res) => {
            setNumReport({numReport: res.data.total_reported});
          })
          .catch((err) => {console.log(err)})
      }
  }
    return (
        <Flex flexWrap='wrap'>
            <VStack minWidth='320px' w='22vw' spacing='20px'>
                <StatCard title={"Average Rating"} num={avgRating.avgRating} delta={avgRating.avgRatingDelta} unit={"☆"}/>
                <StatCard title={"Average Response Rate"} num={avgRespTime.avgRespTime} delta={avgRespTime.avgRespTimeDelta} unit={"s"}/>
                <StatCard title={"Average Course Comfortability Rating"} num={avgComfort.avgComfort} delta={avgComfort.avgComfortDelta} unit={"☆"}/>
                <StatCard title={"Reported Conversations"} num={numReport.numReport} delta={0} unit={""}/>
            </VStack>
            <Spacer/>
            <DatedGraph isWeekly={isWeekly} courseID={{courseID}}/>
        </Flex>
    );
}

export default DatedStats;