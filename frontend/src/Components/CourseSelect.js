import { Box } from '@chakra-ui/react';
import { FormControl } from '@mui/material';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import InputLabel from '@mui/material/InputLabel';

const CourseSelect = ({courses, setCurrCourse, inConvo, currCourse}) => {

    return (
        <Box w='150px'>
          <FormControl fullWidth size="small">
            <InputLabel id="course-select-label" style={{fontFamily: 'Poppins'}}>Course</InputLabel>
            <Select 
              sx={{ '.MuiOutlinedInput-notchedOutline': { border: 0 } }}
              className="mui-select mb-5"
              labelId="course-select-label"
              label="Course"
              id="course-select"
              style={{
                  background: 'white',
                  borderRadius: '5px',
                  padding: '0px',
                  boxShadow: '1px 2px 3px 1px rgba(0,0,0,0.12)',
                  fontFamily: 'Poppins',
              }}
              onChange={(e) => {
                  setCurrCourse(courses[parseInt(e.target.value)]);
                  sessionStorage.setItem('selected', parseInt(e.target.value).toString())
                  // Object.keys(courses[parseInt(e.target.value)]).forEach((key) => {sessionStorage.setItem(key, courses[parseInt(e.target.value)][key])});
              }}
              value={parseInt(sessionStorage.getItem('selected'))}
              isDisabled={inConvo}
              >
                  {courses.map(({course_code}, index) => (<MenuItem paddingLeft={8} key={index} value={index} style={{ fontFamily: 'Poppins'}}>{course_code}</MenuItem>))}
              </Select>
          </FormControl>
        </Box>
    );
}

export default CourseSelect;