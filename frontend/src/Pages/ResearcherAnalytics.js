import TopNav from "../Components/TopNav";
import Dashboard from "../Components/Dashboard/Dashboard";
import {Button, Spinner} from "@chakra-ui/react";
import React from "react";
import {Link} from 'react-router-dom'

const ResearcherAnalytics = ({UTORid, courseCode, courseName, semester, currCourse, setCurrCourse, courses, isLoading, setIsLoading, userid}) => {
        return (
          isLoading ? <Spinner/> :
          <div style={{
            backgroundColor: "#F1F1F1",
            width: "100vw",
            height: 'auto'
          }}>
              <TopNav UTORid={UTORid}/>
              <Dashboard
                userid={userid}
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