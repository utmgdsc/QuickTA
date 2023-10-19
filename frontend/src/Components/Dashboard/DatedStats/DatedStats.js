import {
  VStack,
  Flex,
  Spacer,
  useDisclosure,
  HStack,
} from "@chakra-ui/react";
import StatCard from "../components/StatCard";
import React, { useEffect } from "react";
import axios from "axios";
import { useState } from "react";
import FrequencyCard from "./FrequencyCard";
import AnalyticsCard from "../components/AnalyticsCard";
import DatedLineChart from "../components/DatedLineChart";
import { Grid } from "@mui/material";
import UniqueUsersCard from "./UniqueUsersCard";
import ChatlogResponseRateCard from "./ChatlogResponseRateCard";
import ConversationResponseRateCard from "./ConversationResponseRateCard";
import ReportedConversationCard from "./ReportedConversationsCard";
import SurveyDistributionBarChart from "../components/SurveyDistributionBarChart";


const DatedStats = ({ isWeekly, courseID, setIsLoading }) => {
  const [avgRating, setAvgRating] = useState({
    avgRating: 0,
    avgRatingDelta: 0,
  });
  
  const [avgComfort, setAvgComfort] = useState({
    avgComfort: 0,
    avgComfortDelta: 0,
  });
  const [numReport, setNumReport] = useState({ numReport: 0 });
  const [commonWords, setCommonWords] = useState([]);

  // Fetch file loader for headers
  const fileDownload = require("js-file-download");
  const [error, setError] = useState();
  function computePrevAvg(data, currAvg) {
    // we need to look at avg of indices 0, .. , data-2
    if (data.length <= 1) {
      return 0;
    }
    let x = currAvg * data.length;
    x -= data[data.length - 1];
    if (data.length === 1) {
      return Math.round((currAvg - x / 1) * 100) / 100;
    } else {
      return Math.round((currAvg - x / (data.length - 1)) * 100) / 100;
    }
  }

  
  const fetchData = async (endpoint) => {

    if (endpoint.endsWith("most-common-words")) {
      return await axios
        .get(
          process.env.REACT_APP_API_URL +
            endpoint +
            `?filter=${
              isWeekly === 1 ? "Weekly" : isWeekly === 0 ? "Monthly" : "All"
            }&course_id=${courseID}&timezone=America/Toronto`
        )
        .then((res) => {
          let max = 0.0;
          let min = 0.0;
          res.data.most_common_words.forEach((word) => {
            if (word[1] > max) {
              max = word[1];
            }
            if (word[1] < min) {
              min = word[1];
            }
          });
          setCommonWords(
            res.data.most_common_words.map((word) => [
              word[0],
              1 - (word[1] - min) / (max - min),
            ])
          );
        })
        .catch((err) => {
          setError(err);
          // console.log(err);
        });
    }
  };

  useEffect(() => {
    if (courseID) {
      setIsLoading(true);
      fetchData("/researchers/most-common-words");
      setIsLoading(false);
    }
  }, [courseID]);

  return (
    <>
      <Grid container columnSpacing={{ xs: 1, md: 2}} rowSpacing={{ xs: 1, md: 2 }}>
        <Grid item xs={6} md={3} className="border">
          <UniqueUsersCard courseID={courseID} />
        </Grid>
        <Grid item xs={6} md={3} className="border">
          <ChatlogResponseRateCard courseID={courseID} />
        </Grid>
        <Grid item xs={6} md={3} className="border">
          <ConversationResponseRateCard courseID={courseID} />
        </Grid>
        <Grid item xs={6} md={3} className="border">
          <ReportedConversationCard courseID={courseID} />
        </Grid>
        <Grid item xs={12} md={6} className="border">
          <AnalyticsCard>
            <DatedLineChart 
              title={"Interaction Frequency"} 
              courseID={courseID}
              height={385}
            />
          </AnalyticsCard>
        </Grid>
        <Grid item xs={12} md={6} className="border">
          <AnalyticsCard>
            <SurveyDistributionBarChart 
              title={"Pre-Survey Question Distribution"}
              height={342}
              questionIds={[
                "a4dffcc8-1ee4-4361-99b3-6231772b0e19",
                "1a8ddf81-501d-4254-a0c8-4704ef081326",
                "5625f3ba-b627-4927-a43e-b711796ef9b1",
                "b1532779-eb57-4f0b-9ed0-55274921e5f4"
              ]}
            />
          </AnalyticsCard>
        </Grid>
      </Grid>


          

         
         

      {/* <FrequencyCard
        words={commonWords}
        callBack={() => {
          if (courseID && isWeekly != null) {
            axios
              .get(
                process.env.REACT_APP_API_URL +
                  "/researchers/most-common-words-wordcloud",
                {
                  params: {
                    filter:
                      isWeekly === 1
                        ? "Weekly"
                        : isWeekly === 0
                        ? "Monthly"
                        : "All",
                    course_id: courseID,
                    timezone: "America/Toronto",
                  },
                  responseType: "arraybuffer",
                }
              )
              .then((response) => {
                const imageData = new Uint8Array(response.data);
                const imageBlob = new Blob([imageData], { type: "image/png" });
                const imageUrl = URL.createObjectURL(imageBlob);
                const link = document.createElement("a");
                link.href = imageUrl;
                link.download = "image.png";
                document.body.appendChild(link);
                link.click();
              })
              .catch((err) => {
                setError(err);
                // console.log(err);
                onErrOpen();
              });
          }
        }}
        m={4}
      /> */}
      {/* <ErrorDrawer error={error} isOpen={isErrOpen} onClose={onErrClose} /> */}
    </>
  );
};

export default DatedStats;
