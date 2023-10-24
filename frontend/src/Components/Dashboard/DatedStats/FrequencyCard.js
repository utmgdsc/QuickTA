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
import { CircularProgress, FormControl, InputLabel, TextField } from "@mui/material";

const FrequencyCard = ({ courseID }) => {

  const [words, setCommonWords] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [numWords, setNumWords] = useState(30);
  const [gramSize, setGramSize] = useState(3);

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
        process.env.REACT_APP_API_URL + "/researchers/most-common-words",
        {
          params: {
            filter: "All",
            course_id: courseID,
            timezone: "America/Toronto",
            num_words: numWords,
            max_ngram_size: gramSize,
          },
        }
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
    if (numWords && gramSize) {
      setIsLoading(true);
      getMostCommonTopics();
    }
  }, [courseID, numWords, gramSize]);

  return (
    <Box className="d-flex flex-col h-100" style={{ padding: '20px' }}>
      <Box>
        <span style={titleStyle}>Most Common Words</span>
      </Box>
      {/* Result */}
      <Box className="d-flex flex-col justify-content-start h-100 py-3 py-md-2">
        <Box>
           {/* Settings controller */}
            <Box className="m-3 mt-1">
              <FormControl fullWidth size="small">
                <HStack spacing={3} mt={3}>
                    <TextField
                      size="small"
                      type="number"
                      variant="outlined"
                      label="Number of Words"
                      value={numWords}
                      onChange={(e) => setNumWords(e.target.value)}
                    />
                  <Box>
                    <TextField
                      size="small"
                      type="number"
                      variant="outlined"
                      value={gramSize}
                      label="N-Gram Size"
                      onChange={(e) => setGramSize(e.target.value)}
                    />
                  </Box>
                </HStack>
              </FormControl>
            </Box>

            <Box className="d-flex justify-content align-items-center mx-3">
              <Text className="me-2">Less Frequent</Text>
              <Box
                bgGradient={"linear(to-r, #FFFFFF, rgb(93,133,212))"}
                w={"100%"}
                h={"10px"}
                borderRadius={"lg"}
              />
              <Text className="ms-2">More Frequent</Text>
            </Box>
          <Divider my={3} />
        </Box>
        <Box
          className="d-flex flex-wrap justify-content-center align-items-center"
          style={{ gap: "8px" }}
        >
          {isLoading ? 
            <Box className="h-100 d-flex justify-content-center align-items-center"
              style={{ minHeight: "300px" }}
            >
              <CircularProgress />
            </Box>
          : words.length === 0 ? (
            <div 
              className="d-flex justify-content-center align-items-center" 
              style={{ minHeight: "300px", width: "100%", textAlign: "center", }} >
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
        </Box>
      </Box>
    </Box>
  ) 
};


export default FrequencyCard;
