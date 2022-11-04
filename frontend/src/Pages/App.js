
import TopNav from "../Components/TopNav";
import Chat from "../Components/Chat/Chat"
import {Box, Button, Center} from "@chakra-ui/react";
import "../assets/globals.css";
import { BrowserRouter, Route, Router, Routes } from 'react-router-dom';
import { Link } from "react-router-dom";
import StudentPage from "./StudentPage";
import LoginPage from "./LoginPage";
import ProfessorPage from "./ProfessorPage";
import ResearcherPage from "./ResearcherPage";


function App() {
  return(
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LoginPage/>} />
          <Route path="/Student" element={<StudentPage/>} />
          <Route path="/Professor" element={<ProfessorPage/>} />
          <Route path="/Researcher" element={<ResearcherPage/>}/>
        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App;
