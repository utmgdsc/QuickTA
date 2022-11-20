import TopNav from "../Components/TopNav";
import Dashboard from "../Components/Dashboard/Dashboard"


const ResearcherPage = ({UTORid, courseCode, courseName, semester}) => {
    return(
        <div style={{
            backgroundColor: "#F1F1F1",
            width: "100vw",
            height: '165vh'
        }}>
            <TopNav UTORid={"UTORid"}/>
            <Dashboard courseCode={"CSC311H5"} semester={"2022F"} courseName={"Introduction to Computer Programming"}
                       style={{position: 'relative'}}/>
        </div>
    );
};


export default ResearcherPage;