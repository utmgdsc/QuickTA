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
      </Box>
    </div>
  );
};

export default ResearcherModels;
