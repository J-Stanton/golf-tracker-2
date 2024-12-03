import React, { useState, useEffect } from "react";
import "./HandicapView.css";
import { getAllHandicapMembers, getHandicapScores, updateHandicapScore } from "../../firebase/firebaseHelper";
import Navbar from "../../components/Navbar/Navbar";

function HandicapView() {
  const [members, setMembers] = useState([]);
  const [selectedMemberId, setSelectedMemberId] = useState(null);
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchMembers = async () => {
      const membersData = await getAllHandicapMembers();
      setMembers(membersData);
    };

    fetchMembers();
  }, []);

  const handleMemberSelection = async (memberId) => {
    setSelectedMemberId(memberId);
    setLoading(true);
    const memberGames = await getHandicapScores(memberId);
    setGames(memberGames);
    setLoading(false);
  };

  const handleScoreEdit = (index, newScore) => {
    const updatedGames = games.map((game, i) => 
      i === index ? { ...game, score: newScore } : game
    );
    setGames(updatedGames);
  };

  const handleSaveScore = async (index) => {
    const game = games[index];
    if (selectedMemberId && game) {
      await updateHandicapScore(selectedMemberId, game.date, game.score);
      alert("Score updated successfully!");
    }
  };

  return (<>
    <Navbar />
    <div className="handicap-view">
      <div className="sidebar">
        <h2>Members</h2>
        <ul>
          {Object.entries(members).map(([id, member]) => (
            <li key={id}>
              <label>
                <input
                  type="radio"
                  name="member"
                  value={id}
                  onChange={() => handleMemberSelection(id)}
                  checked={selectedMemberId === id}
                />
                {member.name}
              </label>
            </li>
          ))}
        </ul>
      </div>
      <div className="games-display">
        {loading ? (
          <p>Loading games...</p>
        ) : (
          <>
            <h2>Games</h2>
            {selectedMemberId && games.length > 0 ? (
              <table>
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Score</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {games.map((game, index) => (
                    <tr key={game.date}>
                      <td className="table-cell">{game.date}</td>
                      <td className="table-cell">
                        <input
                          type="number"
                          value={game.score}
                          onChange={(e) => handleScoreEdit(index, e.target.value)}
                        />
                      </td>
                      <td>
                        <button onClick={() => handleSaveScore(index)}>Save</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p>Select a member to view their games.</p>
            )}
          </>
        )}
      </div>
    </div>
    </>
  );
}

export default HandicapView;
