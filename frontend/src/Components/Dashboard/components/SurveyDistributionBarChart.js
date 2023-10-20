import { useState, useEffect } from "react";
import axios from "axios";
import { BarChart } from '@mui/x-charts/BarChart';
import { PieChart, pieArcLabelClasses } from '@mui/x-charts/PieChart';
import { ButtonGroup, FormControl, InputLabel, Box, MenuItem, Select, IconButton, Button, CircularProgress } from "@mui/material";
import PieChartIcon from '@mui/icons-material/PieChart';
import BarChartIcon from '@mui/icons-material/BarChart';



const SurveyDistributionBarChart = ({ title, height, questionIds }) => {

    // BarChart Data
    const [isLoading, setIsLoading] = useState(true);
    const [questionId, setQuestionId] = useState(questionIds[0]);
    const [questionText, setQuestionText] = useState("");
    const [questionType, setQuestionType] = useState("");
    const [data, setData] = useState([2, 3, 4]);
    const [labels, setLabels] = useState(['a', 'b', 'c']);
    const [chartStyle, setChartStyle] = useState("BarChart");

    // PieChart Data
    const [pieChartData, setPieChartData] = useState([])
    const [pieChartColors, setPieChartColors] = useState([
        "#8EAAE1",
        // "#7E9EDD",
        "#6E91D8",
        // "#5E85D4",
        "#4E79D0",
        // "#3E6DCC",
        "#3363C1",
        // "#2F5BB1",
        "#2B52A1",
        "#224281",
        "#1A3161"

    ])

    // Style Definition 
    const titleStyle = {
        fontSize: "16px",
        fontWeight: "700",
    }
    const questionTypeStyle = {
        fontSize: "14px",
        fontWeight: "600",
    }
    const questionTextStyle = {
        fontSize: "14px",
        lineHeight: "1.15",
        color: "#718096",
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
     * Parse the code into title case given "AAA_BBB" format into "Aaa Bbb"
     * @param {String} questionType 
     */
    const parseQuestionType = (questionType) => {
        let parsed = questionType.split("_");
        parsed = parsed.map((word) => {
            return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
        });
        return parsed.join(" ");
    }


    const getSurveyQuestionDistribution = () => {
        setIsLoading(true);
        axios.get(process.env.REACT_APP_API_URL + '/researchers/v2/pre-survey-distribution', {
            params: {
                question_id: questionId
            }})
        .then((res) => {
            let data = res.data;
            let type = parseQuestionType(data.type);
            setQuestionText(data.question);
            setQuestionType(type)
            setData(data.distribution.map((item) => item.count));
            console.log(data.distribution.map((item, index) => ({ id: index, label: item.answer, value: item.count })))
            switch (type) {
                case "Multiple Choice":
                    setLabels(data.distribution.map((item) => item.label));
                    setPieChartData(data.distribution.map((item, index) => ({ id: index, label: item.label, value: item.count })));
                    break;
                case "Scale":
                    setLabels(data.distribution.map((item) => (item.answer))); 
                    setPieChartData(data.distribution.map((item, index) => ({ id: index, label: item.answer, value: item.count })));
                    break;
            }
            setIsLoading(false);
        })
        .catch((error) => {
            console.log(error);
            setIsLoading(false);
        })
    }

    const selectQuestion = (event) => {
        setQuestionId(event.target.value);
    }

    const getArcLabel = (params) => {
        let total = pieChartData.reduce((acc, cur) => acc + cur.value, 1);
        const percent = params.value / total;
        return `${(percent * 100).toFixed(0)}%`;
      };

    useEffect(() => {
        getSurveyQuestionDistribution();
    }, [questionId]);

    return (
        <Box style={{ padding: '20px'}}> 
            <Box className="d-flex flex-col w-100">
                <Box className="d-flex w-100 justify-content-between ">
                    <span style={titleStyle}>{title}</span>

                    <ButtonGroup
                        size="small"
                        disableElevation
                        variant="contained"
                        aria-label="Disabled elevation buttons"
                        >
                        <Button style={{ backgroundColor: chartStyle === 'PieChart' ? "#CCC" : "#2C54A6" }}
                            onClick={() => setChartStyle("BarChart")}
                        >
                            <BarChartIcon />
                        </Button>
                        <Button style={{ backgroundColor: chartStyle === 'BarChart' ? "#CCC" : "#2C54A6" }}
                            onClick={() => setChartStyle("PieChart")}
                        >
                            <PieChartIcon />
                        </Button>
                    </ButtonGroup>
                </Box>

                {/* Question Selection */}
                <FormControl style={{ marginTop: "15px" }}>
                    <InputLabel id="question-select">Question Select</InputLabel>
                    <Select 
                        labelId="question-select"
                        id="question-select"
                        label="Question Select"
                        size="small"
                        value={questionId ? questionId : questionIds ? questionIds[0] : ""}
                        onChange={selectQuestion}
                    >
                        {questionIds 
                            ? questionIds.map((questionId, index) => <MenuItem value={questionId}>{`Question ${index + 1}`}</MenuItem>)
                            : <MenuItem disabled>No options available</MenuItem>
                        }
                    </Select>
                </FormControl>
                <Box className="d-flex flex-col" mt={2}>
                    <span style={questionTypeStyle}>{questionType}</span>
                    <span style={questionTextStyle}>{questionText}</span>
                </Box>  
            </Box>
            {isLoading ? 
                    <div className="w-100 h-100 d-flex justify-content-center align-items-center"
                        style={{ minHeight: height }}
                    >
                        <CircularProgress />
                    </div>
                : data.length > 0 && labels.length > 0 && 
                <Box>
                    {/* Pie Chart */}
                    {chartStyle === "PieChart" &&
                        <PieChart 
                            height={height}
                            colors={pieChartColors}
                            series={
                                [{ 
                                    data: pieChartData,
                                    outerRadius: 120,
                                    arcLabel: getArcLabel,
                                
                                }]
                            }
                            slotProps={{ legend: { offset: { x: -40} } }}
                            sx={{ 
                                "& .MuiChartsLegend-label": { fontSize: "10px", fontWeight: "500" },
                            [`& .${pieArcLabelClasses.root}`]: { fill: 'white', fontSize: 14 }
                            }}
                        />
                    }

                    {/* Bar Chart */}
                    {chartStyle === "BarChart" &&
                        <BarChart
                            height={height}
                            series={[{ data: data, label: "Number of Students Response", id: "count", color: "#5E85D4" }]}
                            xAxis={[{ data: labels, scaleType: "band" }]}
                            slotProps={{ legend: { offset: { x: -70 } } }}
                            sx={barChartStyle}  
                        />
                    }
                </Box>
            }
        </Box>
    )
}

export default SurveyDistributionBarChart;