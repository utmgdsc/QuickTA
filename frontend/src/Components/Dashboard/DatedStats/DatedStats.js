import {
  VStack,
  Flex,
  Spacer,
  Button, Tooltip
} from "@chakra-ui/react";
import StatCard from "./StatCard";
import DatedGraph from "./DatedGraph"
import {useEffect} from "react";
import axios from "axios";
import {useState} from "react";
import FrequencyCard from "./FrequencyCard";
import fileDownload from "js-file-download";

const DatedStats = ({isWeekly, courseID, setIsLoading}) => {
  const [avgRating, setAvgRating] = useState({avgRating : 0, avgRatingDelta: 0});
  const [avgRespTime, setAvgRespTime] = useState({avgRespTime: 0, avgRespTimeDelta: 0});
  const [avgComfort, setAvgComfort] = useState({avgComfort: 0, avgComfortDelta: 0});
  const [numReport, setNumReport] = useState({numReport: 0});
  const [commonWords, setCommonWords] = useState([]);

  // Fetch file loader for headers
  const fileDownload = require('js-file-download');

  function computePrevAvg(data, currAvg){
    // we need to look at avg of indices 0, .. , data-2
    if (data.length <= 1){
      return 0;
    }
    let x = currAvg * data.length;
    x -= data[data.length - 1];
    return Math.round((currAvg - (x / (data.length - 1))) * 100) / 100;
  }

  const fetchData = async (endpoint) => {
      if (endpoint.endsWith("average-ratings")){
        return await axios.post(process.env.REACT_APP_API_URL + endpoint, {filter: (isWeekly === 1 ? "Weekly" : (isWeekly === 0 ? "Monthly" : "All")),
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
        return await axios.post(process.env.REACT_APP_API_URL + endpoint, {filter: (isWeekly === 1 ? "Weekly" : (isWeekly === 0 ? "Monthly" : "All")),
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
        return await axios.post(process.env.REACT_APP_API_URL + endpoint, {filter: (isWeekly === 1 ? "Weekly" : (isWeekly === 0 ? "Monthly" : "All")),
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
        console.log("need reported conversations")
        return await axios.post(process.env.REACT_APP_API_URL + endpoint, {filter: (isWeekly === 1 ? "Weekly" : (isWeekly === 0 ? "Monthly" : "All")),
          course_id: courseID, timezone: "America/Toronto"})
          .then((res) => {
            setNumReport({numReport: res.data.total_reported});
          })
          .catch((err) => {console.log(err)})
      }

      if(endpoint.endsWith("most-common-words")){
        return await axios.post(process.env.REACT_APP_API_URL + endpoint, {filter: (isWeekly === 1 ? "Weekly" : (isWeekly === 0 ? "Monthly" : "All")),
        course_id: courseID, timezone: "America/Toronto"})
          .then((res) => {
            let max = 0.0
            let min = 0.0
            res.data.most_common_words.forEach((word) => {
              if(word[1] > max){
                max = word[1]
              }
              if (word[1] < min){
                min = word[1]
              }
            })
            setCommonWords(res.data.most_common_words.map((word) => ([word[0], 1-(((word[1] - min)) / (max - min))])));
          })
          .catch((err) => console.log(err))
      }
  }

  useEffect(() => {
    if(courseID){
      setIsLoading(true);
      fetchData("/researcher/average-ratings");
      fetchData("/researcher/avg-comfortability-rating");
      fetchData("/researcher/avg-response-rate");
      fetchData("/researcher/reported-conversations");
      fetchData("/researcher/most-common-words");
      setIsLoading(false);
    }
  }, [courseID])

    
    return (
      <>
        <Flex flexWrap='wrap' mt={5} mb={5}>
            <VStack minWidth='320px' w='22vw' spacing='20px'>
                
                <StatCard callBack={() => {
                  if(courseID && isWeekly != null){
                    axios.post(process.env.REACT_APP_API_URL + "/researcher/average-ratings-csv", {filter: (isWeekly === 1 ? "Weekly" : (isWeekly === 0 ? "Monthly" : "All")),
                    course_id: courseID, timezone: "America/Toronto"})
                    .then((response) => {
                      if(response.headers['content-disposition']){
                        fileDownload(response.data, response.headers['content-disposition'].split('"')[1]);
                      }
                    })
                    .catch((err) => console.log(err))
                  }
                }} title={"Average Rating"} num={avgRating.avgRating} delta={avgRating.avgRatingDelta} unit={"☆"}/>

                
                <StatCard callBack={() => {
                  if(courseID && isWeekly != null){
                    axios.post(process.env.REACT_APP_API_URL + "/researcher/avg-response-rate-csv", {filter: (isWeekly === 1 ? "Weekly" : (isWeekly === 0 ? "Monthly" : "All")),
                    course_id: courseID, timezone: "America/Toronto"})
                    .then((response) => {
                      if(response.headers['content-disposition']){
                        fileDownload(response.data, response.headers['content-disposition'].split('"')[1]);
                      }
                    })
                    .catch((err) => console.log(err))
                  }
                }} title={"Average Response Rate"} num={avgRespTime.avgRespTime} delta={avgRespTime.avgRespTimeDelta} unit={"s"}/>
                
                <StatCard callBack={() => {
                  if(courseID && isWeekly != null){
                    axios.post(process.env.REACT_APP_API_URL + "/researcher/avg-comfortability-rating-csv", {filter: (isWeekly === 1 ? "Weekly" : (isWeekly === 0 ? "Monthly" : "All")),
                    course_id: courseID, timezone: "America/Toronto"})
                    .then((response) => {
                      if(response.headers['content-disposition']){
                        fileDownload(response.data, response.headers['content-disposition'].split('"')[1]);
                      }
                    })
                    .catch((err) => console.log(err))
                  }
                }} title={"Average Course Comfortability Rating"} num={avgComfort.avgComfort} delta={avgComfort.avgComfortDelta} unit={"☆"}/>
                
                <StatCard callBack={() => {
                  if(courseID && isWeekly != null){
                    axios.post(process.env.REACT_APP_API_URL + "/researcher/reported-conversations-csv", {filter: (isWeekly === 1 ? "Weekly" : (isWeekly === 0 ? "Monthly" : "All")),
                    course_id: courseID, timezone: "America/Toronto"})
                    .then((response) => {
                      if(response.headers['content-disposition']){
                        fileDownload(response.data, response.headers['content-disposition'].split('"')[1]);
                      }
                    })
                    .catch((err) => console.log(err))
                  }
                }} title={"Reported Conversations"} num={numReport.numReport} delta={0} unit={""}/>
                
            </VStack>
            <Spacer/>
            <DatedGraph isWeekly={isWeekly} courseID={courseID}/>
        </Flex>
        <FrequencyCard words={commonWords} callBack={() => {
          if(courseID && isWeekly != null){
            axios.get(process.env.REACT_APP_API_URL + "/researcher/most-common-words-wordcloud", {
            params : {
              filter: (isWeekly === 1 ? "Weekly" : (isWeekly === 0 ? "Monthly" : "All")),
              course_id: courseID,
              timezone: "America/Toronto",
            },
              responseType:'arraybuffer'
            })
              .then((response) => {
                const imageData = new Uint8Array(response.data);
                const imageBlob = new Blob([imageData], {type: 'image/png'});
                const imageUrl = URL.createObjectURL(imageBlob);

                const link = document.createElement('a');
                link.href = imageUrl;
                link.download = 'image.png';
                document.body.appendChild(link);
                link.click();
              })
              .catch((err) => console.log(err))
          }
        }} m={4}/>
      </>
    );
}

export default DatedStats;