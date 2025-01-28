import React from "react";
import { Link } from "react-router-dom";
import logo from "client/public/logo123.webp"
import './Navbar.css';

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="left-container">
        <img src={logo} alt="Logo" className="logo" />
        <h1 className="title">BlockExplorer</h1>
      </div>

      <div className="right-container">
        <Link to="/" >Home</Link> 
        <Link to="/statistics">BlockStats</Link>
      </div>
    </nav>

    
  );
};






export default Navbar;
