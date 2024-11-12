import React from "react";
import { Link } from 'react-router-dom';
import './Navbar.css';

function Navbar(){
    return(
        <div className="navbar" >
             <Link to="/" className="home-link">Home</Link>
            <h1 className="navbar-header">Early Birds Golf Tracker</h1>
        </div>
    )
}

export default Navbar;