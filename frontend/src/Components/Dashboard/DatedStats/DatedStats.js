import React, { useEffect } from "react";
import { useState } from "react";
import FrequencyCard from "./FrequencyCard";
import AnalyticsCard from "../components/AnalyticsCard";
import DatedLineChart from "../components/DatedLineChart";
import { Grid } from "@mui/material";
import UniqueUsersCard from "./UniqueUsersCard";
import ChatlogResponseRateCard from "./ChatlogResponseRateCard";
import ConversationResponseRateCard from "./ConversationResponseRateCard";
import TotalConversationCountCard from "./TotalConversationCountCard";
import ReportedConversationCard from "./ReportedConversationsCard";
import SurveyDistributionBarChart from "../components/SurveyDistributionBarChart";
import ConversationCountDistributionBarChart from "../components/ConversationCountDistributionBarChart";


const DatedStats = ({ courseID}) => {

  return (
    <>
      <Grid container columnSpacing={{ xs: 1, md: 2}} rowSpacing={{ xs: 1, md: 2 }}>
        {/* Row 1 */}
        <Grid item xs={6} md={3}>
          <UniqueUsersCard courseID={courseID} />
        </Grid>
        <Grid item xs={6} md={3}>
          {/* <ReportedConversationCard courseID={courseID} /> */}
          <TotalConversationCountCard courseID={courseID} />
        </Grid>
        <Grid item xs={6} md={3}>
          <ChatlogResponseRateCard courseID={courseID} />
        </Grid>
        <Grid item xs={6} md={3}>
          <ConversationResponseRateCard courseID={courseID} />
        </Grid>
        {/* Row 2 */}
        <Grid item xs={12} md={6} xl={3}>
          <AnalyticsCard>
            <DatedLineChart 
              title={"Interaction Frequency"} 
              courseID={courseID}
              height={385}
            />
          </AnalyticsCard>
        </Grid>
        <Grid item xs={12} md={6} xl={3}>
        <AnalyticsCard>
            <ConversationCountDistributionBarChart 
              title={"Conversation Per User Distribution"} 
              courseID={courseID}
              height={342} 
            />
          </AnalyticsCard>
        </Grid>
        {/* Row 3 */}
        <Grid item xs={12} md={6} xl={3}>
          <AnalyticsCard>
              <SurveyDistributionBarChart 
                title={"Pre-Survey Question Distribution"}
                courseID={courseID}
                height={342}
                questionIds={[
                  "a4dffcc8-1ee4-4361-99b3-6231772b0e19",
                  "1a8ddf81-501d-4254-a0c8-4704ef081326",
                  "5625f3ba-b627-4927-a43e-b711796ef9b1",
                  "b1532779-eb57-4f0b-9ed0-55274921e5f4"
                ]}
              />
            </AnalyticsCard>
        </Grid>
        <Grid item xs={12} md={6} xl={3}>
          <AnalyticsCard>
            <FrequencyCard courseID={courseID} m={4} />
          </AnalyticsCard>
        </Grid>
      </Grid>
    </>
  );
};

export default DatedStats;
