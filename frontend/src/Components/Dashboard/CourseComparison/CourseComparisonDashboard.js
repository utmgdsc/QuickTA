import { Box, Grid } from "@mui/material";
import AnalyticsCard from "../components/AnalyticsCard";
import DatedLineChart from "../components/DatedLineChart";
import ConversationPerModelBarChart from "./components/ConversationPerModelBarChart";

const CourseComparisonDashboard = ({ courseID }) => {
    return (
        <div>
        <h1>Course Comparison Dashboard</h1>

        {/* Analytic Cards */}
        <Box>
            <Grid container>
                <Grid item xs={12} sm={6}>
                    <AnalyticsCard>
                        <ConversationPerModelBarChart
                            title={"Interaction Frequency"} 
                            courseID={courseID}
                            height={385}
                        />
                    </AnalyticsCard>
                </Grid>
            </Grid>
        </Box>
        <Box>
        </Box>
        </div>
    );
}

export default CourseComparisonDashboard;