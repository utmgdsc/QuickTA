import React, { useState, useEffect } from "react";
import axios from "axios";
import fileDownload from "js-file-download";
import StatCard from "../components/StatCard";

const ChatlogResponseRateCard = ({ courseID }) => {

    const [avgRespTime, setAvgRespTime] = useState({
        avgRespTime: 0,
        avgRespTimeDelta: 0,
      });

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
                if (timeArr[1] !== "00") { timeDeltaStr += `${timeArr[1]}m `; }

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
                `/researchers/avg-response-rate-csv?filter=${"Weekly"}&course_id=${courseID}&timezone=America/Toronto`
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
            process.env.REACT_APP_API_URL +
              `/researchers/avg-response-rate?filter=${"Weekly"}&course_id=${courseID}&timezone=America/Toronto`
          )
          .then((res) => {
            setAvgRespTime({avgRespTime: parseTimeDelta(res.data.avg_response_rate)});
          })
          .catch((err) => { console.log(err) });
      }

    useEffect(() => {
        getAverageChatlogResponseRate();
    }, []);
      


    return (
        <StatCard
        callBack={downloadChatlogResponseRates}
        title={"Average Message Response Rate"}
        label={avgRespTime.avgRespTime}
        helpText={"The time between a user message and last bot response"}
      />
    );
}

export default ChatlogResponseRateCard;