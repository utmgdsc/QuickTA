import { Box, Tabs, TabList, TabPanels, Tab, TabPanel } from "@chakra-ui/react";
import DatedStats from "./DatedStats/DatedStats";
import ReportTable from "./ReportTable/ReportTable";

const DashboardBody = ({ 
  courseID, 
  setIsLoading,
  userScope,
  setUserScope,
  deploymentFilter,
  setDeploymentFilter
}) => {
  const tabStyle = {
    borderRadius: "lg",
    color: "white",
    bg: "#2C54A7",
    padding: "sm",
  };
  return (
    <Box className="pb-5" style={{ marginTop: "6px" }}>
        <DatedStats
          isWeekly={1}
          courseID={courseID}
          setIsLoading={setIsLoading}
          userScope={userScope}
          deploymentFilter={deploymentFilter}
        />
        <ReportTable
          course_ID={courseID}
          isWeekly={1}
          setIsLoading={setIsLoading}
        />
    </Box>
  );
};

export default DashboardBody;
