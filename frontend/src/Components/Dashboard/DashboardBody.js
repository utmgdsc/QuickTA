import { Box, Tabs, TabList, TabPanels, Tab, TabPanel } from "@chakra-ui/react";
import DatedStats from "./DatedStats/DatedStats";
import ReportTable from "./ReportTable/ReportTable";
import CourseComparisonDashboard from "./CourseComparison/CourseComparisonDashboard";

const DashboardBody = ({ 
  courseID, 
  setIsLoading,
  userScope,
  deploymentFilter,
  tabIndex,
}) => {

  const tabStyle = {
    borderRadius: "lg",
    color: "white",
    bg: "#2C54A7",
    padding: "sm",
  };
  return (
    <Box className="pb-5" style={{ marginTop: "6px" }}>
      {tabIndex == 0 &&
        <div>
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
        </div>
      }
      {tabIndex === 1 &&
        <CourseComparisonDashboard 
          courseID={courseID}
        />
      }
    </Box>
  );
};

export default DashboardBody;
