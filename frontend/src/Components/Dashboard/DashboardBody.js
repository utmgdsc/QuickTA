import { 
    Box,
    Container,
    Tabs, 
    TabList, 
    TabPanels, 
    Tab, 
    TabPanel
} from "@chakra-ui/react";
import DatedStats from "./DatedStats/DatedStats";
import ReportTable from "./ReportTable/ReportTable";

const DashboardBody = ({ courseCode }) => {
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
                </TabList>

                <TabPanels>
                    <TabPanel paddingLeft={'0'} paddingRight={'0'}>
                        <DatedStats isWeekly={1} courseCode={courseCode}/>
                    </TabPanel>
                    <TabPanel paddingLeft={'0'} paddingRight={'0'}>
                        <DatedStats isWeekly={0} courseCode={courseCode}/>
                    </TabPanel>
                </TabPanels>

            </Tabs>
            <ReportTable course_ID={courseCode}/>
        </Box>
    );
}

export default DashboardBody;