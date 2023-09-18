import {
    Box, 
    Heading,
} from "@chakra-ui/react";
import { Temporal } from "@js-temporal/polyfill";
import axios from "axios";
import React, { useState, useEffect } from "react";
import Chart from "react-apexcharts";

const DatedGraph = ({isWeekly, courseID}) => {
    // console.log(isWeekly);
    const [category, setCategory] = useState([]);
    const [data, setData] = useState ([]);
    const cardStyle = {
        backgroundColor: 'white', 
        boxShadow: '1px 2px 3px 1px rgba(0,0,0,0.12)', 
        borderRadius: '15px', 
        padding: '15px 40px 10px 40px',
        width: '50vw',
        marginRight: '1%'
    };
    const titleStyle = {
        fontSize: "20px",
        lineHeight: '25px'
    }

    const fetchGraphData = async () => {
        return await axios.get(process.env.REACT_APP_API_URL + `/researchers/interaction-frequency?course_id=${courseID}&filter=${(isWeekly === 1 ? "Weekly" : "Monthly")}&timezone=America/Toronto`)
        .then((res) => {
            // console.log(isWeekly, "Call");
            if (isWeekly === 1) {
                
                let x = {
                    day: [],
                    dayData: []
                };

                const { day, dayData } = res.data.interactions.reduce((obj, currDay) => {
                    obj.day.push(currDay[1]);
                    obj.dayData.push(currDay[2]);
                    return obj;
                }, x);
                setCategory(day);
                setData(dayData);
                // console.log(day);
                // console.log(dayData);
            
            } else {
                // console.log("rendering monthly data");
                const currDate = Temporal.Now.plainDateISO().toString();
                const currDay = currDate.substring(currDate.length-2);
                let x = {
                    date: [],
                    dateData: []
                };

                const { date, dateData } = res.data.interactions.reduce((obj, currData) => {
                    // console.log(currData);
                    obj.date.push(currData[0]);
                    if(currDay < currData[0].substring(currData[0].length - 2)){
                        obj.dateData.push(null);
                    }else{
                        obj.dateData.push(currData[2]);
                    }
                    return obj;
                }, x);
                setData(dateData);
                setCategory(date);
                // console.log(dateData);
                // console.log(date);
            }
        })
        .catch((err) => console.log(err))
    }

    useEffect(()=>{
        if(courseID){
            fetchGraphData();
        }
    }, [courseID, isWeekly]);
    

    return (
        <Box style={cardStyle}>
            <Heading as='h2'><span style={titleStyle}>Total Interactions</span></Heading>
            
            <Chart options={{
                    chart: {
                        id: 'Total Interactions'
                    },
                    xaxis: {
                        categories: category
                    },
                    noData: {
                        text: "Loading...",
                        align: 'center',
                        verticalAlign: 'middle',
                        offsetX: 0,
                        offsetY: 0,
                        style: {
                          color: "black",
                          fontSize: '50px',
                          fontFamily: "Arial"
                        }
                      }
                }} 
                series={[{
                    name: 'Interactions',
                    data: data
                }]} type="line" 
            />
        </Box>
    );
}

export default DatedGraph;