import {
  VStack,
  Flex,
  Spacer,
  Button,
  Tooltip,
  useDisclosure,
  HStack,
} from "@chakra-ui/react";
import StatCard from "./StatCard";
import DatedGraph from "./DatedGraph";
import React, { useEffect } from "react";
import axios from "axios";
import { useState } from "react";
import FrequencyCard from "./FrequencyCard";
import fileDownload from "js-file-download";
import ErrorDrawer from "../../ErrorDrawer";

const DatedStats = ({ isWeekly, courseID, setIsLoading }) => {
  const [avgRating, setAvgRating] = useState({
    avgRating: 0,
    avgRatingDelta: 0,
  });
  const [avgRespTime, setAvgRespTime] = useState({
    avgRespTime: 0,
    avgRespTimeDelta: 0,
  });
  const [avgComfort, setAvgComfort] = useState({
    avgComfort: 0,
    avgComfortDelta: 0,
  });
  const [numReport, setNumReport] = useState({ numReport: 0 });
  const [commonWords, setCommonWords] = useState([]);

  // Fetch file loader for headers
  const fileDownload = require("js-file-download");
  const {
    isOpen: isErrOpen,
    onOpen: onErrOpen,
    onClose: onErrClose,
  } = useDisclosure();
  const [error, setError] = useState();
  function computePrevAvg(data, currAvg) {
    // we need to look at avg of indices 0, .. , data-2
    if (data.length <= 1) {
      return 0;
    }
    let x = currAvg * data.length;
    x -= data[data.length - 1];
    if(data.length === 1){
      return Math.round((currAvg - x / (1)) * 100) / 100;
    }else{
      return Math.round((currAvg - x / (data.length - 1)) * 100) / 100;
    }
  }

  const fetchData = async (endpoint) => {
    if (endpoint.endsWith("average-ratings")) {
      return await axios
        .get(
          process.env.REACT_APP_API_URL +
            endpoint +
            `?filter=${
              isWeekly === 1 ? "Weekly" : isWeekly === 0 ? "Monthly" : "All"
            }&course_id=${courseID}&timezone=America/Toronto`
        )
        .then((res) => {
          setAvgRating({
            avgRating: Math.round(res.data.avg_rating * 100) / 100,
            avgRatingDelta: computePrevAvg(
              res.data.all_ratings,
              res.data.avg_rating
            ),
          });
        })
        .catch((err) => {
          setError(err);
          onErrOpen();
        });
    }

    if (endpoint.endsWith("avg-comfortability")) {
      return await axios
        .get(
          process.env.REACT_APP_API_URL +
            endpoint +
            `?filter=${
              isWeekly === 1 ? "Weekly" : isWeekly === 0 ? "Monthly" : "All"
            }&course_id=${courseID}&timezone=America/Toronto`
        )
        .then((res) => {
          setAvgComfort({
            avgComfort:
              Math.round(res.data.avg_comfortability_rating * 100) / 100,
            avgComfortDelta: computePrevAvg(
              res.data.comfortability_ratings,
              res.data.avg_comfortability_rating
            ),
          });
        })
        .catch((err) => {
          setError(err);
          onErrOpen();
        });
    }

    if (endpoint.endsWith("avg-response-rate")) {
      return await axios
        .get(
          process.env.REACT_APP_API_URL +
            endpoint +
            `?filter=${
              isWeekly === 1 ? "Weekly" : isWeekly === 0 ? "Monthly" : "All"
            }&course_id=${courseID}&timezone=America/Toronto`
        )
        .then((res) => {
          setAvgRespTime({
            avgRespTime: Math.round(res.data.avg_response_rate * 100) / 100,
            avgRespTimeDelta: computePrevAvg(
              res.data.all_response_rates,
              res.data.avg_response_rate
            ),
          });
        })
        .catch((err) => {
          setError(err);
          onErrOpen();
        });
    }

    if (endpoint.endsWith("reported-conversations")) {
      console.log("need reported conversations");
      return await axios
        .get(
          process.env.REACT_APP_API_URL +
            endpoint +
            `?filter=${
              isWeekly === 1 ? "Weekly" : isWeekly === 0 ? "Monthly" : "All"
            }&course_id=${courseID}&timezone=America/Toronto`
        )
        .then((res) => {
          setNumReport({ numReport: res.data.total_reported });
        })
        .catch((err) => {
          setError(err);
          onErrOpen();
        });
    }

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
          onErrOpen();
        });
    }
  };

  useEffect(() => {
    if (courseID) {
      setIsLoading(true);
      fetchData("/researchers/average-ratings");
      // fetchData("/researchers/avg-comfortability");
      fetchData("/researchers/avg-response-rate");
      fetchData("/researchers/reported-conversations");
      fetchData("/researchers/most-common-words");
      setIsLoading(false);
    }
  }, [courseID]);

  return (
    <>
      <Flex flexWrap="wrap" mt={5} mb={5}>
        <HStack>
          <VStack minWidth="320px" w="22vw" spacing="20px">
            <StatCard
              callBack={() => {
                if (courseID && isWeekly != null) {
                  axios
                    .get(
                      process.env.REACT_APP_API_URL +
                        `/researchers/feedback-csv?filter=${
                          isWeekly === 1
                            ? "Weekly"
                            : isWeekly === 0
                            ? "Monthly"
                            : "All"
                        }&course_id=${courseID}&timezone=America/Toronto`
                    )
                    .then((response) => {
                      if (response.headers["content-disposition"]) {
                        fileDownload(
                          response.data,
                          response.headers["content-disposition"].split('"')[1]
                        );
                      }
                    })
                    .catch((err) => {
                      setError(err);
                      onErrOpen();
                    });
                }
              }}
              title={"Average Rating"}
              num={avgRating.avgRating}
              delta={avgRating.avgRatingDelta}
              unit={"☆"}
            />

            <StatCard
              callBack={() => {
                if (courseID && isWeekly != null) {
                  axios
                    .get(
                      process.env.REACT_APP_API_URL +
                        `/researchers/avg-response-rate-csv?filter=${
                          isWeekly === 1
                            ? "Weekly"
                            : isWeekly === 0
                            ? "Monthly"
                            : "All"
                        }&course_id=${courseID}&timezone=America/Toronto`
                    )
                    .then((response) => {
                      if (response.headers["content-disposition"]) {
                        fileDownload(
                          response.data,
                          response.headers["content-disposition"].split('"')[1]
                        );
                      }
                    })
                    .catch((err) => {
                      setError(err);
                      onErrOpen();
                    });
                }
              }}
              title={"Average Response Rate"}
              num={avgRespTime.avgRespTime}
              delta={avgRespTime.avgRespTimeDelta}
              unit={"s"}
            />

            <StatCard
              callBack={() => {
                if (courseID && isWeekly != null) {
                  axios
                    .get(
                      process.env.REACT_APP_API_URL +
                        `/researchers/reported-conversations-csv?filter=${
                          isWeekly === 1
                            ? "Weekly"
                            : isWeekly === 0
                            ? "Monthly"
                            : "All"
                        }&course_id=${courseID}&timezone=America/Toronto`
                    )
                    .then((response) => {
                      if (response.headers["content-disposition"]) {
                        fileDownload(
                          response.data,
                          response.headers["content-disposition"].split('"')[1]
                        );
                      }
                    })
                    .catch((err) => {
                      setError(err);
                      onErrOpen();
                    });
                }
              }}
              title={"Reported Conversations"}
              num={numReport.numReport}
              delta={0}
              unit={""}
            />
            </VStack>
          <Spacer />
          <DatedGraph isWeekly={isWeekly} courseID={courseID} />
          </HStack>
        </Flex>
      <FrequencyCard
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
                onErrOpen();
              });
          }
        }}
        m={4}
      />
      <ErrorDrawer error={error} isOpen={isErrOpen} onClose={onErrClose} />
    </>
  );
};

export default DatedStats;
