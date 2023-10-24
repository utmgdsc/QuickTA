import { Box, Heading, useDisclosure } from "@chakra-ui/react";
import axios from "axios";
import React, { useState, useEffect } from "react";
import ErrorDrawer from "../../ErrorDrawer";
import { LineChart } from '@mui/x-charts/LineChart';

const DatedGraph = ({ isWeekly, courseID }) => {
  // console.log(isWeekly);
  const [dates, setDates] = useState([]);
  const [counts, setCounts] = useState([]);
  const cardStyle = {
    backgroundColor: "white",
    boxShadow: "1px 2px 3px 1px rgba(0,0,0,0.12)",
    borderRadius: "15px",
    padding: "15px 40px 10px 40px",
    width: "50vw",
    marginRight: "1%",
  };
  const titleStyle = {
    fontSize: "20px",
    lineHeight: "25px",
  };
  const {
    isOpen: isErrOpen,
    onOpen: onErrOpen,
    onClose: onErrClose,
  } = useDisclosure();
  const [error, setError] = useState();
  const fetchGraphData = async () => {
    let startDate = '2023-09-01';
    let endDate = '2023-12-31';
    return await axios
      .get(
        process.env.REACT_APP_API_URL +
          `/researchers/v2/interaction-frequency?course_id=${courseID}&start_date=${startDate}&end_date=${endDate}`
      )
      .then((res) => {
        let data = res.data.interactions 
        let _dates = [];
        let _counts = [];
        data.forEach((element) => {
          let year = element.day.substring(0, 4);
          let month = element.day.substring(5, 7);
          let day = element.day.substring(8, 10);
          let date = new Date(year, month, day);
          _dates.push(date);
          _counts.push(element.count);
        });

        console.log(_dates);
        console.log(_counts);

        setDates(_dates);
        setCounts(_counts);
      })
      .catch((err) => {
        setError(err);
        // console.log(err);
        // onErrOpen();
      });
  };

  useEffect(() => {
    if (courseID) {
      fetchGraphData();
    }
  }, [courseID, isWeekly]);

  return (
    <>
      <Box style={cardStyle}>
        <Heading>
          <span style={titleStyle}>Total Interactions</span>
        </Heading>
        {/* {data} */}
        <LineChart 
          fontFamily="Poppins"
          xAxis={[
            {
              id: 'Dates',
              data: dates,
              scaleType: 'time',
              valueFormatter: (date) => { 
                return date.toLocaleDateString("en-US", { month: 'short', day: 'numeric' })
              }
            }
          ]}
          series={[
            {
              id: 'Interaction Count',
              label: 'Number of Interactions',
              data: counts,
            }
          ]}
          // dataset={data}
          width={600}
          height={400}
        />
      </Box>
      <ErrorDrawer error={error} isOpen={isErrOpen} onClose={onErrClose} />
    </>
  );
};

export default DatedGraph;
