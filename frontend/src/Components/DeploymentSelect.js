import { Box } from '@chakra-ui/react';
import { Autocomplete, FormControl } from '@mui/material';
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
const DeploymentSelect = ({courseID, deploymentFilter, setDeploymentFilter}) => {

    const [deploymentList, setDeploymentList] = useState([]);

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

    const getCourseDeployments = async () => {
        // const roles = await axios.get(process.env.REACT_APP_API_URL + `/course/deployments?course_id=${courseID}`)
        await axios.get(process.env.REACT_APP_API_URL + `/course/deployment?course_id=${courseID}`)
            .then((res) => {
                let data = res.data;
                setDeploymentList(data.deployments);

                let cache = localStorage.getItem('qta_deploymentFilter')
                if (cache) { setDeploymentFilter(JSON.parse(cache)) }
            })
    }

    const handleDeploymentFilterChange = (event, value) => {
        localStorage.setItem('qta_deploymentFilter', JSON.stringify(value))
        setDeploymentFilter(value)
    }

    useEffect(() => {
        getCourseDeployments()
    }, [])

    return (
        <Box maxW='500px' minW='300px'>
          <FormControl fullWidth size="small">
            <Autocomplete
                id="user-scope-multiselect"
                size='small'
                multiple
                filterSelectedOptions
                options={deploymentList}
                getOptionLabel={(option) => option.deployment_name}
                isOptionEqualToValue={(option, value) => option.deployment_id == value.deployment_id}
                value={deploymentFilter}
                onChange={(event, value) => {handleDeploymentFilterChange(event, value)}}
                renderInput={(params) => (
                    <TextField {...params}  label="Course Deployment Filter" />
                )}
                renderTags={(value, getTagProps) => {
                    return value.map((option, index) => (
                        <Chip
                            size="small"
                            variant="filled"
                            label={option.deployment_name}
                            sx={chipStyle}
                            {...getTagProps({ index })} 
                        />
                    ))}
                }
                sx={multiselectStyle}
            />
          </FormControl>
        </Box>
    );
}

export default DeploymentSelect;