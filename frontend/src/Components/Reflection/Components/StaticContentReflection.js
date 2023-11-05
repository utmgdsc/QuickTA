import React from 'react';
import { Text } from '@chakra-ui/react';
import { Alert, Box, Grid } from '@mui/material';
import { Button } from "@chakra-ui/button";
import axios from 'axios';

const StaticContentReflection = ({ userId, stepId, setStepId}) => {

    const TOTAL_SLIDE_NUM = 8;

    const handleNextStep = () => {
        setStepId(stepId + 1);
        axios.post(process.env.REACT_APP_API_URL + "/user/stat", {
            userId: userId,
            operation: "static_content_reflection_next_step",
        })
    }

    return (
        <div className="container pb-1">
            {/* Title */}
            <div className="d-flex align-items-center">
                <div className="d-flex flex-col">
                    <Text as="h1" style={{ fontFamily: "Poppins", fontWeight: 500, fontSize: "28px", }}>
                        Lecture Key Slides Review
                    </Text>
                    <Text className="mt-2 text-secondary">
                    Here are some key slides from the lecture you should keep in mind as you are making progress in the course.
                    </Text>
                </div>
            </div>
            {/* Images for static content */}
            <Grid container mt={4}>
                {/* Map from 1 to 5 */}
                {[...Array(TOTAL_SLIDE_NUM).keys()].map((i) => {
                    return (
                        <Grid xs={12} md={6} key={i} className={i === TOTAL_SLIDE_NUM-1 ? "bg-primary-subtle p-3" : "bg-primary-subtle p-3 pb-0"}>
                            <img src={`/reflection/slide${i+1}.png`} alt="StaticContentReflection" style={{ width: "100%", maxWidth: "800px" }} />
                        </Grid>
                    )
                })}
            </Grid>
            {/* Navigation */}
            <Box className="my-2 mb-3 d-flex justify-content-end">
                <Button
                    className="grey-button p-2"
                    style={{ borderRadius: "5px" }}
                    onClick={handleNextStep}
                >
                    Next
                </Button>
            </Box>

        </div>  
    )
}
export default StaticContentReflection;