import React, { useState, useEffect } from "react";
import axios from "axios";
import fileDownload from "js-file-download";
import StatCard from "../components/StatCard";

const ConversationResponseRateCard = ({ courseID }) => {

    const [avgRespTime, setAvgRespTime] = useState("");
    

    /**
     * Turns a time delta string into a more readable format
     * @param {Time Delta} timeDelta (ie. '1 day 3:34:39.029')
     * @returns Parsed time delta (ie. '1 day 3h 34m 39s')
     */
    const parseTimeDelta = (timeDelta) => {
        let timeDeltaArr = timeDelta.split(" ");
        let timeDeltaStr = "";
        for (let i = 0; i < timeDeltaArr.length; i++) {
            if (timeDeltaArr[i].includes(":")) {
                // drop the milliseconds and only show hour and minutes if they are non-zero
                let timeArr = timeDeltaArr[i].split(":");
                timeArr[2] = timeArr[2].split(".")[0];
                if (timeArr[0] !== "0") { timeDeltaStr += `${timeArr[0]}h `; }
                if (timeArr[1] !== "00") { 
                  if (timeArr[1][0] === "0") { timeArr[1] = timeArr[1].substring(1); }
                  timeDeltaStr += `${timeArr[1]}m `; 
                }
                if (timeArr[2][0] === "0") { timeArr[2] = timeArr[2].substring(1); }
                timeDeltaStr += `${timeArr[2]}s`;
            } else {
                timeDeltaStr += `${timeDeltaArr[i]} `;
            }
        }
        return timeDeltaStr;
    };


    /**
     * This function is called when the user clicks the download button.
     */
    const downloadChatlogResponseRates = () => {
        if (courseID) {
          axios
            .get(
              process.env.REACT_APP_API_URL +
                `/researchers/avg-response-rate-csv?filter=${"All"}&course_id=${courseID}&timezone=America/Toronto`
            )
            .then((response) => {
              if (response.headers["content-disposition"]) {
                fileDownload(
                  response.data,
                  response.headers["content-disposition"].split('"')[1]
                );
              }
            })
            .catch((err) => { console.log(err) });
        }
    }

    /**
     * This function is called when the page is loaded,
     * to acquire the average chatlog response rate.
     */
    const getAverageChatlogResponseRate = async () => {
        await axios
          .get(
            process.env.REACT_APP_API_URL + `/researchers/v2/avg-conversation-response-rate`,
              { params: { course_id: courseID } }
          )
          .then((res) => {
            setAvgRespTime(parseTimeDelta(res.data.average_response_rate));
          })
          .catch((err) => { console.log(err) });
      }

    useEffect(() => {
        getAverageChatlogResponseRate();
    }, []);
      


    return (
        <StatCard
        callBack={downloadChatlogResponseRates}
        title={"Average Conversation Response Rate"}
        label={avgRespTime}
        helpText={"the time between ending a conversation and starting a new one"}
      />
    );
}

export default ConversationResponseRateCard;