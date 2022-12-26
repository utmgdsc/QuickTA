import {
    Box,
    Tabs,
    TabList,
    TabPanels,
    Tab,
    TabPanel
} from "@chakra-ui/react";
import DatedStats from "./DatedStats/DatedStats";
import ReportTable from "./ReportTable/ReportTable";

const DashboardBody = ({ courseID, setIsLoading }) => {
    const tabStyle = {
        borderRadius: 'lg',
        color: 'white',
        bg: '#2C54A7',
        padding: "sm"
    };
    return (
        <Box>
            <Tabs variant='solid-rounded' mt={7}>

                <TabList>
                    <Tab _selected={tabStyle}><span style={{fontSize: '13px'}}>Weekly</span></Tab>
                    <Tab _selected={tabStyle}><span style={{fontSize: '13px'}}>Monthly</span></Tab>
                    <Tab _selected={tabStyle}><span style={{fontSize: '13px'}}>All</span></Tab>
                </TabList>

                <TabPanels>
                    <TabPanel paddingLeft={'0'} paddingRight={'0'}>
                        <DatedStats isWeekly={1} courseID={courseID} setIsLoading={setIsLoading}/>
                        <ReportTable course_ID={courseID} isWeekly={1} setIsLoading={setIsLoading}/>
                    </TabPanel>
                    <TabPanel paddingLeft={'0'} paddingRight={'0'}>
                        <DatedStats isWeekly={0} courseID={courseID} setIsLoading={setIsLoading}/>
                        <ReportTable course_ID={courseID} isWeekly={0} setIsLoading={setIsLoading}/>
                    </TabPanel>
                    <TabPanel>
                        <DatedStats isWeekly={2} courseID={courseID} setIsLoading={setIsLoading}/>
                        <ReportTable course_ID={courseID} setIsLoading={setIsLoading} isWeekly={2}/>
                    </TabPanel>
                </TabPanels>
            </Tabs>

        </Box>
    );
}

export default DashboardBody;