import React, { useState, useRef } from "react";
import "./HandicapForm.css"; // Import the CSS file
import Navbar from "../../components/Navbar/Navbar";

function HandicapForm() {
  const players = ["Alice", "Bob", "Charlie", "Diana"];
  const [currPlayer, setCurrPlayer] = useState(0);
  const [played, setPlayed] = useState(null);
  const [scores, setScores] = useState({});
  const scoreInputRef = useRef(null);

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
      [players[currPlayer]]: score,
    }));
    goToNextPlayer();
  };

  const goToNextPlayer = () => {
    setPlayed(null);
    setCurrPlayer((prevIndex) => prevIndex + 1);
  };

  if (currPlayer >= players.length) {
    return(
        <>
            <Navbar />
            <div className="handicap-form">
                <div className="form-container">
                    <h2>All Done!</h2>
                    <div>
                    <h3>Scores:</h3>
                    {players.map((player) => (
                        <div key={player}>
                        <p>
                            {player}: {scores[player] ? scores[player] : "Did not play"}
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
