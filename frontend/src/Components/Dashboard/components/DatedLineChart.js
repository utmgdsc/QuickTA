import dayjs from 'dayjs';
import axios from "axios";
import { useState, useEffect } from "react";
import { LineChart } from '@mui/x-charts/LineChart';
import { CircularProgress } from "@mui/material";
import DateRange from "./DateRange";

const DatedLineChart = ({
    title,
    courseID,
    height
}) => {
const [isLoading, setIsLoading] = useState(true);
const [dates, setDates] = useState([]);
const [counts, setCounts] = useState([]);
const [accCounts, setAccCounts] = useState([0]);
const [dateLabels, setDateLabels] = useState([]);
const [minDate, setMinDate] = useState(0);
const [maxDate, setMaxDate] = useState(0);
const [startDate, setStartDate] = useState(null);
const [endDate, setEndDate] = useState(null);


const fetchGraphData = async () => {
    
    setIsLoading(true);

    // get startDate and endDate in 'YYYY-MM-DD' format
    let _startDate = startDate.format('YYYY-MM-DD');
    let _endDate = endDate.format('YYYY-MM-DD');
    
    return await axios
    .get(
        process.env.REACT_APP_API_URL +
        `/researchers/v2/interaction-frequency?course_id=${courseID}&start_date=${_startDate}&end_date=${_endDate}`
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
        setIsLoading(false);
    })
    .catch((err) => {
        setIsLoading(false);
    });

};

/**
 * Get a list of dates between startDate and endDate
 * @param {Starting Date in 'YYYY-MM-DD' format} startDate 
 * @param {Ending Date in 'YYYY-MM-DD' format} endDate 
 */
const getDatesBetween = (startDate, endDate) => {

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

const getDateString = (date) => {
    let month = (date.getMonth() + 1).toString().padStart(2, '0');
    let day = (date.getDate()).toString().padStart(2, '0');
    let dateString = date.getFullYear().toString() + "-" + month + "-" + day;
    return dateString
}

useEffect(() => {
    if (!startDate || !endDate) {
        // get todays date in yyyy-mm-dd as end date
        let today = new Date();
        setEndDate(dayjs(getDateString(today)));
        
        // get last week info - 7 days before end date
        today.setDate(today.getDate() - 7);
        setStartDate(dayjs(getDateString(today)));
    }
}, []);

useEffect(() => {
    if (startDate && endDate) {
        fetchGraphData();
    }
}, [startDate, endDate]);

return <div style={{ padding: '20px'}}>
        <h2 style={{ fontWeight: '700' }}>{title}</h2> 
        {/* Time Range Picker */}
        <DateRange 
            startDate={startDate} 
            setStartDate={setStartDate}
            endDate={endDate} 
            setEndDate={setEndDate}
        />
    {isLoading 
        ? <div className="d-flex justify-content-center align-items-center" style={{height: "385px"}}> <CircularProgress /> </div>
        : dates.length > 0 && counts.length > 0 &&
            <LineChart 
                height={height}
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
                        id: 'Accumulated Interaction Count',
                        label: 'Accumulated Number of Interactions',
                        data: accCounts,
                        // showMark: ({ index }) => index % 2 === 0,
                        area: true,
                        curve: "catmullRom"
                    },
                    {
                        id: 'Interaction Count',
                        label: 'Number of Interactions',
                        data: counts,
                        area: true,
                        curve: "catmullRom"
                    },
                ]}
                slotProps={{
                    legend: {
                        direction: 'column',
                        offset: { x: -70 }
                    }
                }}
        
                sx={{
                    "& .MuiChartsAxis-directionX": {
                        "& .MuiChartsAxis-tickLabel": {
                            rotate: "-0deg",
                            fontSize: "10px"
                        },
                    },
                    "& .MuiChartsLegend-label": {
                        fontSize: "14px",
                        fontWeight: "500"
                    }
                }}  
            /> 
            }    
    </div>;
};

export default DatedLineChart;