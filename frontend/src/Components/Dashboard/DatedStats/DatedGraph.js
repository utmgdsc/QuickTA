import {
    Box, 
    Heading
} from "@chakra-ui/react";
import React, { useState, useEffect } from "react";
import Chart from "react-apexcharts";

const DatedGraph = ({isWeekly, courseID}) => {
    const [category, setCategory] = useState([])
    const [data, setData] = useState ([])
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

    useEffect (() => {
        try {
            if (isWeekly) {
                console.log("week");
                setCategory(['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'])
                setData([30, 40, 45, 50, 49, 60, 70])

            } else {
                console.log("month");
                setCategory(['JAN', 'FEB', 'MAR', 'APR'])
                setData([30, 40, 45, 50])
            }
        } catch (e) {
            alert(e);
        }
    }, [isWeekly]);

    return (
        <Box style={cardStyle}>
            <Heading as='h2'><span style={titleStyle}>Total Interactions</span></Heading>
            <Chart options={{
                    chart: {
                        id: 'Total Interactions'
                    },
                    xaxis: {
                        categories: category
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