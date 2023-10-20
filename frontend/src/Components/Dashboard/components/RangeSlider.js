import * as React from 'react';
import Box from '@mui/material/Box';
import Slider from '@mui/material/Slider';


export default function RangeSlider({ minmax, value, setValue, marks }) {

  // Sample:  const [value, setValue] = React.useState([20, 37]);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Box>
      <Slider
        value={value}
        min={minmax[0]}
        max={minmax[1]}
        onChange={handleChange}
        valueLabelDisplay="auto"
        marks={marks}
      />
    </Box>
  );
}