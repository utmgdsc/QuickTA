import TopNav from "../Components/TopNav";
import Dashboard from "../Components/Dashboard/Dashboard"


const ResearcherPage = ({UTORid, courseCode, courseName}) => {
    return(
        <div style={{
            backgroundColor: "#F1F1F1",
            width: "100vw",
            height: '110vh'
        }}>
            <TopNav UTORid={"UTORid"}/>
            <Dashboard courseCode={"CSC108"} courseName={"Introduction to Computer Programming"} style={{position: 'relative'}}/>
        </div>
    );
};


export default ResearcherPage;