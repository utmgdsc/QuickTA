import TopNav from "../Components/TopNav";
import Chat from "../Components/Chat/Chat";

const StudentPage = ({UTORid, courseCode}) => {
    return (
    <div style={{
        backgroundColor: "#F1F1F1",
        width: "100vw",
        height: '110vh'
      }}>
        <TopNav UTORid={"UTORid"}/>
        <Chat courseCode={"CSC108H5"} semester={"2022F"} style={{position: 'relative'}}/>
    </div>
    );
};


export default StudentPage;