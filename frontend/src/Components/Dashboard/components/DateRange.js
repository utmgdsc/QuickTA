import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

const DateRange = ({
    startDate,
    endDate,
    setStartDate,
    setEndDate
}) => {
    const datePickerStyle = {
        '& .MuiInputBase-input': {
            padding: '10px',
        }
    }

    return <div className="d-flex" style={{ marginTop: "12px" }}>
        <div>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                        label="Start Date"
                        value={startDate}
                        maxDate={endDate}
                        onChange={(newValue) => setStartDate(newValue)}
                        sx={datePickerStyle}
                    />
            </LocalizationProvider>
        </div>
        <div style={{ marginLeft: '8px' }}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                    label="End Date"
                    value={endDate}
                    minDate={startDate}
                    onChange={(newValue) => setEndDate(newValue)}
                    sx={datePickerStyle}
                />
            </LocalizationProvider>
        </div>
    </div>}

export default DateRange;