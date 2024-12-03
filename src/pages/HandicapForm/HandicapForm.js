import React, { useState, useRef, useEffect } from "react";
import "./HandicapForm.css"; // Import the CSS file
import Navbar from "../../components/Navbar/Navbar";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { getAllHandicapMembers,saveHandicapScores } from "../../firebase/firebaseHelper";

function HandicapForm() {
  const [players,setPlayers] = useState([]);
  const [currPlayer, setCurrPlayer] = useState(0);
  const [played, setPlayed] = useState(null);
  const [scores, setScores] = useState({});
  const [loading, setLoading] = useState(true); 
  const [gameDate,setGameDate] = useState(null);
  const scoreInputRef = useRef(null);

  useEffect(() => {
    const fetchMembers = async () => {
      setLoading(true);
      const members = await getAllHandicapMembers();
      const playerNames = Object.values(members).map(member => member.name);  // Extract names only
      setPlayers(playerNames);
      setLoading(false);
    };

    fetchMembers();
  }, []);

  useEffect(() => {
    if (currPlayer >= players.length && players.length > 0) {
      saveHandicapScores({scores,date:gameDate});
    }
  }, [currPlayer, players.length, scores,gameDate]);

  const handlePlayed = (response) => {
    setPlayed(response);
    if (!response) {
      goToNextPlayer();
    }
  };

  const handleScoreSubmit = () => {
    const score = scoreInputRef.current.value;
    setScores((prevScores) => ({
      ...prevScores,
      [currPlayer]: score,
    }));
    goToNextPlayer();
  };

  const goToNextPlayer = () => {
    setPlayed(null);
    setCurrPlayer((prevIndex) => prevIndex + 1);
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="handicap-form">
          <div className="form-container">
            <h2>Loading players...</h2>
          </div>
        </div>
      </>
    );
  }

  if (!gameDate){
    return (
      <>
        <Navbar />
        <div className="handicap-form">
          <div className="form-container">
            <h2>Select the Game Date</h2>
            <DatePicker
              selected={gameDate}
              onChange={(date) => setGameDate(date)}
              placeholderText="Select a date"
            />
            
          </div>
        </div>
      </>
    );
  }

  if (currPlayer >= players.length) {
    return(
        <>
            <Navbar />
            <div className="handicap-form">
                <div className="form-container">
                    <h2>All Done!</h2>
                    <div>
                    <h3>Scores:</h3>
                    {players.map((player,index) => (
                        <div key={index}>
                        <p>
                            {player}: {scores[index] ? scores[index] : "Did not play"}
                        </p>
                        </div>
                    ))}
                    </div>
                </div>
            </div>
        </>
    );
  }

  return (
    <>
        <Navbar />
        <div className="handicap-form">
        <div className="form-container">
            <h2 className="handicap-header">Player: {players[currPlayer]}</h2>

            {played === null && (
            <div className="question-section">
                <p>Did {players[currPlayer]} play?</p>
                <button onClick={() => handlePlayed(true)}>Yes</button>
                <button onClick={() => handlePlayed(false)}>No</button>
            </div>
            )}

            {played === true && (
            <div className="score-section">
                <p>Enter the score for {players[currPlayer]}:</p>
                <input
                type="number"
                ref={scoreInputRef}
                placeholder="Score"
                />
                <button onClick={handleScoreSubmit}>Enter</button>
            </div>
            )}
        </div>
        </div>
    </>
  );
}

export default HandicapForm;
