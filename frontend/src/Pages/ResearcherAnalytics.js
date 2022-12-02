import TopNav from "../Components/TopNav";
import Dashboard from "../Components/Dashboard/Dashboard"


const ResearcherAnalytics = ({UTORid, courseCode, courseName, semester}) => {
    return(
        <div style={{
            backgroundColor: "#F1F1F1",
            width: "100vw",
            height: '175vh'
        }}>
            <TopNav UTORid={"UTORid"}/>
            <Dashboard courseCode={"CSC311H5"} semester={"2022F"} courseName={"Introduction to Machine Learning"}
                       style={{position: 'relative'}}/>
        </div>
    );
};


export default ResearcherAnalytics;