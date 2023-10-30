import { Box } from "@mui/material";
import { useState } from "react";
import DateRange from "../../components/DateRange";


const ConversationPerModelBarChart = ({ title, }) => {

    const [isLoading, setIsLoading] = useState(true);
    const [dates, setDates] = useState([]);
    const [counts, setCounts] = useState([]);
    const [accCounts, setAccCounts] = useState([0]);
    const [dateLabels, setDateLabels] = useState([]);
    const [minDate, setMinDate] = useState(0);
    const [maxDate, setMaxDate] = useState(0);
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);

    return (
        <div>
            <h1>ConversationPerModelBarChart</h1>

            <Box className="d-flex flex-col h-100" style={{ padding: '20px'}}>
                <Box>
                    <p style={{ fontWeight: '700' }}>{title}</p> 
                    {/* Time Range Picker */}
                    <DateRange 
                        startDate={startDate} 
                        setStartDate={setStartDate}
                        endDate={endDate} 
                        setEndDate={setEndDate}
                    />
                </Box>
            </Box>
        </div>
    );
}

export default ConversationPerModelBarChart;