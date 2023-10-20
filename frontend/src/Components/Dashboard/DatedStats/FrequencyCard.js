import {
  Box,
  Divider,
  HStack,
  Stat,
  StatLabel,
  Tag,
  TagLabel,
  Text,
  Tooltip,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { CircularProgress } from "@mui/material";

const FrequencyCard = ({ courseID }) => {

  const [words, setCommonWords] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const cardStyle = {
    backgroundColor: "white",
    boxShadow: "1px 2px 3px 1px rgba(0,0,0,0.12)",
    borderRadius: "15px",
    padding: "15px 15px 7px 20px",
    textAlign: "left",
  };
  const titleStyle = {
    display: "block",
    fontSize: "16px",
    fontWeight: "700",
    lineHeight: "24px",
  };

  const downloadWordCloud = () => {
    axios
      .get( process.env.REACT_APP_API_URL + "/researchers/most-common-words-wordcloud",
        {
          params: {
            filter: "Weekly",
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
        console.log(err);
      });
  }

  /**
   * Determined based on LDA algorithm
   * @param {*} endpoint 
   * @returns 
   */
  const getMostCommonTopics = async () => {
    return await axios
      .get(
        process.env.REACT_APP_API_URL + "/researchers/most-common-words" + `?filter=${"All"}&course_id=${courseID}&timezone=America/Toronto`
      )
      .then((res) => {
        let data = res.data;
        let max = 0.0;
        let min = 0.0;
        data.most_common_words.forEach((word) => {
          if (word[1] > max) { max = word[1]; }
          if (word[1] < min) { min = word[1]; }
        });
        setCommonWords(data.most_common_words.map((word) => [ word[0], 1 - (word[1] - min) / (max - min) ]) );
        setIsLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setIsLoading(false);
      });
  };

  useEffect(() => {
    getMostCommonTopics();
  }, [courseID]);

  return (
    <Stat style={cardStyle} width={"100%"} >
      <StatLabel>
        <span style={titleStyle}>Most Common Words</span>
      </StatLabel>
      {/* <Divider my={3} /> */}
      <HStack>
        <Text>Less Frequent</Text>
        <Box
          bgGradient={"linear(to-r, #FFFFFF, rgb(93,133,212))"}
          w={"100%"}
          h={"10px"}
          borderRadius={"lg"}
        />
        <Text>More Frequent</Text>
      </HStack>
      <Divider my={3} />
      <HStack
        style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          gap: "8px",
        }}
        // spacing={3}
      >
        {isLoading ? 
          <Box className="d-flex justify-content-center align-items-center">
            <CircularProgress />
          </Box>
        : words.length === 0 ? (
          <div style={{ width: "100%", textAlign: "center", }} >
            No Common Words
          </div>
        ) : (
          words.map((word, index) => (
            <Tag key={index}
              style={{ 
                backgroundColor: `rgba(93,133,212, ${(word[1])})`,
                padding: "5px 10px",
                borderRadius: "10px",
                margin: 0,
              }} 
            >
              <TagLabel style={{ fontSize: "14px" }}>{word[0]}</TagLabel>
            </Tag>
          ))
        )}
      </HStack>
    </Stat>
  ) 
};


export default FrequencyCard;
