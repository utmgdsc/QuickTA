import {
  Box,
} from "@chakra-ui/react";
import TopNav from "../Components/TopNav";
import ModelHeader from "../Components/ModelManager/ModelHeader";
import ModelBody from "../Components/ModelManager/ModelBody";
import CustomSpinner from "../Components/CustomSpinner";
import CourseSelect from "../Components/CourseSelect";
import { useState } from "react";
import NotFoundPage from "../Components/NotFoundPage";
import { BarChart } from '@mui/x-charts/BarChart';

import { LineChart } from '@mui/x-charts/LineChart';
import { useEffect } from "react";
import axios from "axios";


const ResearcherModels = ({
  UTORid,
  auth,
  currCourse,
  setCurrCourse,
  courses,
}) => {
  const [loadingModel, setLoadingModel] = useState(false);

  const [dates, setDates] = useState([]);
  const [counts, setCounts] = useState([]);
  const [accCounts, setAccCounts] = useState([0]);
  const [dateLabels, setDateLabels] = useState([]);
  const [minDate, setMinDate] = useState(0);
  const [maxDate, setMaxDate] = useState(0);

  const fetchGraphData = async () => {
    let startDate = '2023-09-30';
    let endDate = '2023-10-08';
    let courseID = "7f4402cb-23c8-4305-9523-adc747c8fae7";
    return await axios
      .get(
        process.env.REACT_APP_API_URL +
          `/researchers/v2/interaction-frequency?course_id=${courseID}&start_date=${startDate}&end_date=${endDate}`
      )
      .then((res) => {
        let data = res.data.interactions 
        let _data = [];
        let _counts = [];
        let _dateLabels = getDatesBetween(startDate, endDate);
        let _accCounts = [];
        let acc = 0
        // _dates to stores indexes to retrieve labels from dateLabels
        data.forEach((element, index) => {
          acc += element.count;
          _data.push(index);
          _counts.push(element.count);
          _accCounts.push(acc);
        });

        setDates(_data);
        setCounts(_counts);
        setAccCounts(_accCounts);
        setDateLabels(_dateLabels);
        setMinDate(0);
        setMaxDate(_data.length - 1);
      })
      .catch((err) => {
      });
  };

  /**
   * Get a list of dates between startDate and endDate
   * @param {Starting Date in 'YYYY-MM-DD' format} startDate 
   * @param {Ending Date in 'YYYY-MM-DD' format} endDate 
   */
  const getDatesBetween = (startDate, endDate) => {
    // Return a list of dates between startDate and endDate
    let _datesLabels = [];
    let _startDate = new Date(startDate);
    let _endDate = new Date(endDate);
    let currDate = _startDate;
    while (currDate <= _endDate) {
      // format currDate into YYYYMMDD
      let month = (currDate.getMonth() + 1).toString().padStart(2, '0');
      let day = (currDate.getDate()).toString().padStart(2, '0');
      let dateString = month.toString() + "-" + day.toString();
      _datesLabels.push(dateString);
      currDate.setDate(currDate.getDate() + 1);
    }
    return _datesLabels;
  }

  useEffect(() => {
    fetchGraphData();
  }, []);


  if (!["IS", "AM", "RS"].includes(auth)) {
    return <NotFoundPage />;
  }

  return Object.keys(currCourse).length === 0 &&
    currCourse.constructor === Object ? (
    <CustomSpinner />
  ) : (
    <div
      style={{
        backgroundColor: "#F1F1F1",
        width: "100vw",
        height: "100vh",
        overflowY: "scroll",
      }}
    >
      <TopNav UTORid={UTORid} auth={auth} />
      <Box ml={"12vw"} mr={"12vw"}>
        <CourseSelect
          currCourse={currCourse}
          courses={courses}
          setCurrCourse={setCurrCourse}
          wait={loadingModel}
        />
        <ModelHeader
          courseCode={currCourse.course_code}
          courseName={currCourse.course_name}
        />
        <ModelBody
          courseid={currCourse.course_id}
          setLoadingModel={setLoadingModel}
          loadingModel={loadingModel}
        />
        {/*<Link to={"/ResearcherFilters"}>*/}
        {/*  <Button my={5} mx={2} colorScheme={"blue"}>*/}
        {/*    Redirect to Filters*/}
        {/*  </Button>*/}
        {/*</Link>*/}
        {/*<Link to={"/ResearcherAnalytics"}>*/}
        {/*  <Button my={5} mx={2} colorScheme={"blue"}>*/}
        {/*    Redirect to Analytics*/}
        {/*  </Button>*/}
        {/*</Link>*/}
        <BarChart
          xAxis={[{ scaleType: 'band', data: ['group A', 'group B', 'group C'] }]}
          series={[{ data: [4, 3, 5] }, { data: [1, 6, 3] }, { data: [2, 5, 6] }]}
          width={500}
          height={300}
        />
        {dates}
        {dates.length > 0 && counts.length > 0 &&
          <LineChart 
          title="Interaction Frequency"
          label="Number of Interactions"
          tooltip={{
            x: 'band',
            y: 'band'
          }}
          xAxis={[
            {
              id: 'Dates',
              label: 'Date',
              data: dates,
              scaleType: 'integer',
              valueFormatter: (idx) => { return dateLabels[idx] },
              min: minDate,
              max: maxDate,
              tickMinStep: 1,
            }
          ]}
          series={[
            {
              id: 'Interaction Count',
              label: 'Number of Interactions',
              data: counts,
              curve: "catmullRom"
            },
            // {
            //   id: 'Accumulated Interaction Count',
            //   label: 'Accumulated Number of Interactions',
            //   data: accCounts,
            //   fill: 'rgba(0, 0, 0, 0.1)',
            //   showMark: ({ index }) => index % 2 === 0,
            //   curve: "catmullRom"
            // }
          ]}
          // dataset={data}
          // width={1000}
          height={400}
          {...{ legend: {hidden: true}, }}

          sx={{
            "& .MuiChartsAxis-directionX": {
              "& .MuiChartsAxis-tickLabel": {
                rotate: "-0deg",
                fontSize: "10px"
              },
              fontFamily: "Poppins",
            },
            "& .MuiChartsTooltip-root": {
              "& .MuiChartsTooltip-markCell": {
                background: "red",
                color: "blue",

              },
              "& .MuiChartsTooltip-labelCell": {
                background: "red",
                color: "blue",
              }
            },
          }}
        />}
      </Box>
    </div>
  );
};

export default ResearcherModels;
