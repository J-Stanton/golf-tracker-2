import React from "react";
import './Home.css';
import { Navigate, useNavigate } from "react-router-dom";

function Home(){
    const navigate = useNavigate();

    const handleGoToHandicapForm = ()=>{
        navigate("/handicap-form")
    }
    return(
        <div className="home">
            <header className="home-header">
                <h1>Early Birds Golf Tracker</h1>
            </header>
            <div className="home-buttons">
                <button className="home-button" onClick={handleGoToHandicapForm}>Add Handicap Scores</button>
                <button className="home-button">View Handicaps</button>
                <button className="home-button">Add Competition Scores</button>
                <button className="home-button">View Competition Scores</button>
                <button className="home-button">Change Scores</button>
                <button className="home-button">Add Member</button>
            </div>
        </div>
    )
}
export default Home;