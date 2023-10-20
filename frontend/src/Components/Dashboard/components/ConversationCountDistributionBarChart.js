import { useState, useEffect } from "react";
import axios from "axios";
import { BarChart } from '@mui/x-charts/BarChart';
import { Box, CircularProgress } from "@mui/material";
import DateRange from "./DateRange";
import dayjs from 'dayjs';
import RangeSlider from "./RangeSlider";


const SurveyDistributionBarChart = ({ title, courseID, height }) => {

    // BarChart Data
    const [isLoading, setIsLoading] = useState(true);
    const [originalData, setOriginalData] = useState([]);
    const [data, setData] = useState([]);
    const [labels, setLabels] = useState([]);
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    // Slider
    const [value, setValue] = useState([0, 100]);
    const [sliderMarks, setSliderMarks] = useState([]);
    const [sliderMinmax, setSliderMinmax] = useState([0, 100]);

    // Style Definition 
    const titleStyle = {
        fontSize: "16px",
        fontWeight: "700",
    }
    const barChartStyle = {
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
    }

    /**
     * Get dates between start and end date
     */
    const getConversationCountDistribution = () => {
        setIsLoading(true);

        // get startDate and endDate in 'YYYY-MM-DD' format
        let _startDate = startDate.format('YYYY-MM-DD');
        let _endDate = endDate.format('YYYY-MM-DD');

        console.log(_startDate, _endDate)
    
        axios.get(process.env.REACT_APP_API_URL + '/researchers/v2/conversation-per-user-distribution',
            { params: { 
                course_id: courseID,
                start_date: _startDate,
                end_date: _endDate
            } })
            .then((res) => {
                let _labels = res.data.distribution.map((item) => item.conversation_count);
                let _data = res.data.distribution.map((item) => item.user_count);
                setOriginalData(res.data.distribution);
                setLabels(_labels);
                setData(_data);
                setSliderMarks([
                    { value: _labels[0], label: _labels[0] },
                    { value: _labels[_labels.length - 1], label: _labels[_labels.length - 1] },
                ]);
                setSliderMinmax([_labels[0], _labels[_labels.length - 1]]);
                setValue([_labels[0], _labels[_labels.length - 1]]);
                setIsLoading(false);
            })
            .catch((error) => {
                console.log(error);
                setIsLoading(false);
            })
    }

    /**
     * Filter data based on slider value
     */
    const filterData = () => {
        let _labels = originalData.map((item) => item.conversation_count);
        let _data = originalData.map((item) => item.user_count);
        let _filteredData = [];
        let _filteredLabels = [];
        for (let i = 0; i < _labels.length; i++) {
            if (_labels[i] >= value[0] && _labels[i] <= value[1]) {
                _filteredData.push(_data[i]);
                _filteredLabels.push(_labels[i]);
            }
        }
        console.log(_labels, _data, _filteredData, _filteredLabels);
        setData(_filteredData);
        setLabels(_filteredLabels);
    }

    const getDateString = (date) => {
        let month = (date.getMonth() + 1).toString().padStart(2, '0');
        let day = (date.getDate()).toString().padStart(2, '0');
        let dateString = date.getFullYear().toString() + "-" + month + "-" + day;
        return dateString
    }

    // Set default start and end date
    useEffect(() => {
        if (!startDate || !endDate) {
            // get todays date in yyyy-mm-dd as end date
            let today = new Date();
            setEndDate(dayjs(getDateString(today)));
            
            // get start of month
            today.setDate(1);
            setStartDate(dayjs(getDateString(today)));
        }
    }, []);
    
    useEffect(() => { if (originalData) { filterData(); } }, [value]);
    useEffect(() => {
        if (startDate && endDate) { getConversationCountDistribution(); } 
    }, [startDate, endDate]);

    return (
        <Box className="d-flex flex-col  h-100" style={{ padding: '20px'}}> 
            <Box className="w-100">
                <span style={titleStyle}>{title}</span>
            </Box>
            <DateRange 
                startDate={startDate} 
                setStartDate={setStartDate}
                endDate={endDate} 
                setEndDate={setEndDate}
            />
            <Box className="row p-0 m-0 pt-3">
                <Box className="col-3 ">
                    <span>Range Filter</span>
                </Box>
                <Box className="col-8">
                    <RangeSlider 
                        minmax={sliderMinmax}
                        value={value}
                        setValue={setValue}
                        marks={sliderMarks}
                    />
                </Box>
            </Box>
            <Box>
                {isLoading ? 
                    <div className="w-100 h-100 d-flex justify-content-center align-items-center"
                        style={{ minHeight: height }}
                    >
                        <CircularProgress />
                    </div>
                : data.length > 0 && labels.length > 0 ? <BarChart
                    height={height}
                    xAxis={[{ data: labels, label: "Number of Conversations", scaleType: "band" }]}
                    series={[{ data: data, label: "Number of Students", id: "count", color: "#5E85D4" }]}
                    slotProps={{ legend: { offset: { x: -30 } } }}
                    sx={barChartStyle}  
                /> :
                <div className="w-100 h-100 d-flex justify-content-center align-items-center"
                style={{ minHeight: height }}
            >
               <span>No data available</span>
            </div>
                }
            </Box>
        </Box>
    )
}

export default SurveyDistributionBarChart;