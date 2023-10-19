import { Box } from '@chakra-ui/react';
import { Autocomplete, FormControl } from '@mui/material';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import InputLabel from '@mui/material/InputLabel';
import { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import TextField from '@mui/material/TextField';
import Chip from '@mui/material/Chip';


/**
 * Allows users to select the scope of users to include given a list of userScope.
 * @param {state} userScope list containing filtered user scopes
 * @param {state handler} setUserScope setter for userScope
 * @returns 
 */
const UserScopeSelect = ({userScope, setUserScope}) => {

    const [userRoleList, setUserRoleList] = useState([])

    const multiselectStyle = {
        background: "white",
        borderRadius: "5px",
        boxShadow: '1px 2px 3px 1px rgba(0,0,0,0.12)',
        fontSize: '14px',
        fontFamily: 'Poppins',
        '& .MuiInputBase-root': {
            paddingLeft: '6px',
            display: 'flex',
            alignItems: 'center',
        },
        '& .MuiOutlinedInput-notchedOutline': { 
            border: 0 
        },
        '& .MuiInputLabel-root': {
            fontSize: '14px',
            fontFamily: 'Poppins',
        },
        '& .MuiFormLabel-root.MuiInputLabel-root.MuiInputLabel-outlined': {
            textAlign: 'center',
        }
      }

    const textFieldStyle = {
        color: 'red',
    }

    const chipStyle = {
        background: '#EEE',
        color: '#000000',
        fontFamily: 'Poppins',
        fontSize: '12px',
        padding: '2px',
        borderRadius: '5px',
        height: '20px',
        marginTop: '5px',
        marginBottom: '5px',
        marginRight: '5px',
    }

    const getUserRoles = async () => {
        const roles = await axios.get(process.env.REACT_APP_API_URL + '/user/user-roles')
        setUserRoleList(roles.data.roles)
    }

    const selectedUserScopes = useMemo(() => {
        return userScope.map((selectedScope) => selectedScope.name);
    })

    useEffect(() => {
        getUserRoles()
    }, [])

    return (
        <Box w='500px'>
          <FormControl fullWidth size="small">
            <Autocomplete
                id="user-scope-multiselect"
                size='small'
                multiple
                filterSelectedOptions
                options={userRoleList}
                getOptionLabel={(option) => option.name}
                isOptionEqualToValue={(option, value) => option.id == value.id}
                value={userScope}
                onChange={(event, value) => {
                    setUserScope(value)
                }}
                renderInput={(params) => (
                    <TextField {...params} 
                        label="User Scope Filter" style={textFieldStyle} 
                    />
                )}
                renderTags={(value, getTagProps) => {
                    return value.map((option, index) => (
                        <Chip
                            size="small"
                            variant="filled"
                            label={option.name}
                            sx={chipStyle}
                            {...getTagProps({ index })} 
                        />
                    ))}
                }
                sx={multiselectStyle}
            />
            {/* <InputLabel id="course-select-label" style={{fontFamily: 'Poppins'}}>Course</InputLabel> */}
            {/* <Select 
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
              >
                  {courses.map(({course_code}, index) => (<MenuItem paddingLeft={8} key={index} value={index} style={{ fontFamily: 'Poppins'}}>{course_code}</MenuItem>))}
              </Select> */}
          </FormControl>
        </Box>
    );
}

export default UserScopeSelect;