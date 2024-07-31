// src/HomeScreen.jsx
import React from 'react';
import './HomeScreen.css';
import logo from '../../Assets/logo.png'; // Ensure the path is correct
import classroomIcon from '../../Assets/classroom.png'; // Ensure the path is correct
import libraryIcon from '../../Assets/library.png'; // Ensure the path is correct
import backgroundImage from '../../Assets/background.jpg';
import { Link } from 'react-router-dom'; // Ensure the path is correct
import { Route } from 'react-router-dom';

const HomeScreen = () => {
    return (
      <div className="home-screen" style={{ backgroundImage: `url(${backgroundImage})` }}>
        <header className="header">
          <img src={logo} alt="e-Learn Logo" className="logo" />
         
          
          <div className="blue-line"></div>
        </header>
        <div className="main-content">
          <h1>Welcome to Digital Library</h1>
       
          <div className="icon-nav">

           <Link to="/login" className="icon">
           
              <img src={libraryIcon} alt="Library" />
              
              <p>My Library</p>
            
            </Link>
            <div className="icon">
              <img src={classroomIcon} alt="Classroom" />
              <p>Classroom</p>
            </div>
          </div>
        </div>
      </div>
    );
  };
  
  export default HomeScreen;