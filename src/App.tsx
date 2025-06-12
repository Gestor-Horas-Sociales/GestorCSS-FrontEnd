import "./App.css";
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

//Pages
import HomePage from "./Pages/Super_User/HomePage/Home_page";
import LoginPage from "./Pages/Super_User/LogIn/LogIn_page";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage/>} />
        <Route path="/home" element={<HomePage/>} />
      </Routes>
    </Router>
  );
}

export default App;
