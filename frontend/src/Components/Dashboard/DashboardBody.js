import { Box, Tabs, TabList, TabPanels, Tab, TabPanel } from "@chakra-ui/react";
import DatedStats from "./DatedStats/DatedStats";
import ReportTable from "./ReportTable/ReportTable";

const DashboardBody = ({ courseID, setIsLoading }) => {
  const tabStyle = {
    borderRadius: "lg",
    color: "white",
    bg: "#2C54A7",
    padding: "sm",
  };
  return (
    <Box style={{ marginTop: "6px" }}>
        <DatedStats
          isWeekly={1}
          courseID={courseID}
          setIsLoading={setIsLoading}
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
