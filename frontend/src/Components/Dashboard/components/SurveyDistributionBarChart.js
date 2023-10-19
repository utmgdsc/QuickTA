import { useState, useEffect } from "react";
import axios from "axios";
import { BarChart } from '@mui/x-charts/BarChart';
import { FormControl, InputLabel, Box, MenuItem, Select } from "@mui/material";



const SurveyDistributionBarChart = ({ title, height, questionIds }) => {

    const [questionId, setQuestionId] = useState(questionIds[0]);
    const [questionText, setQuestionText] = useState("");
    const [questionType, setQuestionType] = useState("");
    const [data, setData] = useState([2, 3, 4]);
    const [labels, setLabels] = useState(['a', 'b', 'c']);

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
            switch (type) {
                case "Multiple Choice":
                    setLabels(data.distribution.map((item) => item.label));
                    break;
                case "Scale":
                    setLabels(data.distribution.map((item) => (item.answer))); 
                    break;
            }
        })
        .catch((error) => {
            console.log(error);
        })
    }

    const selectQuestion = (event) => {
        setQuestionId(event.target.value);
    }

    useEffect(() => {
        getSurveyQuestionDistribution();
    }, [questionId]);

    return (
        <Box style={{ padding: '20px'}}> 
            <Box className="d-flex flex-col w-100">
                <span style={titleStyle}>{title}</span>

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
            <Box>
                <BarChart
                    height={height}
                    series={[{ data: data, label: "Number of Students Response", id: "count", color: "#5E85D4" }]}
                    xAxis={[{ data: labels, scaleType: "band" }]}
                    slotProps={{ legend: { offset: { x: -70 } } }}
                    sx={barChartStyle}  
                />
            </Box>
        </Box>
    )
}

export default SurveyDistributionBarChart;