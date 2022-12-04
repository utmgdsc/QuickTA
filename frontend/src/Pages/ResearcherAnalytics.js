import TopNav from "../Components/TopNav";
import Dashboard from "../Components/Dashboard/Dashboard";
import {Spinner} from "@chakra-ui/react";

const ResearcherAnalytics = ({UTORid, courseCode, courseName, semester, currCourse, setCurrCourse, courses, isLoading, setIsLoading}) => {
        return (
          isLoading ? <Spinner/> :
          <div style={{
            backgroundColor: "#F1F1F1",
            width: "100vw",
            height: '175vh'
          }}>
              <TopNav UTORid={UTORid}/>
              <Dashboard
                courseCode={courseCode}
                semester={semester}
                courseName={courseName}
                style={{position: 'relative'}}
                currCourse={currCourse}
                setCurrCourse={setCurrCourse}
                courses={courses}
                setIsLoading={setIsLoading}
              />
          </div>
        );
};


export default ResearcherAnalytics;