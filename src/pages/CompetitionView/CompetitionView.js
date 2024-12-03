import React, { useState, useEffect } from "react";
import "./CompetitionView.css";
import {
  getAllCompMembers,
  getCompetitionScores,
  updateCompetitionScore,
} from "../../firebase/firebaseHelper";
import Navbar from "../../components/Navbar/Navbar";

function CompetitionView() {
  const [members, setMembers] = useState([]);
  const [selectedMemberId, setSelectedMemberId] = useState(null);
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchMembers = async () => {
      const membersData = await getAllCompMembers();
      setMembers(membersData);
    };

    fetchMembers();
  }, []);

  const handleMemberSelection = async (memberId) => {
    setSelectedMemberId(memberId);
    setLoading(true);
    try {
      const memberGames = await getCompetitionScores(memberId);

      // Normalize data: ensure 'score' and 'putts' are numbers
      const normalizedGames = Object.entries(memberGames).map(([date, game]) => ({
        date,
        score: Number(game.score),  // Convert score to number
        putts: Number(game.putts),  // Convert putts to number
      }));

      console.log("Normalized games:", normalizedGames);  // Log the normalized data
      setGames(normalizedGames);
    } catch (error) {
      console.error("Error fetching games:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleScoreEdit = (index, newScore) => {
    const updatedGames = games.map((game, i) =>
      i === index ? { ...game, score: newScore } : game
    );
    setGames(updatedGames);
  };

  const handlePuttsEdit = (index, newPutts) => {
    const updatedGames = games.map((game, i) =>
      i === index ? { ...game, putts: newPutts } : game
    );
    setGames(updatedGames);
  };

  const handleSaveGame = async (index) => {
    const game = games[index];
    if (selectedMemberId && game) {
      await updateCompetitionScore(selectedMemberId, game.date, {
        score: game.score,
        putts: game.putts,
      });
      alert("Game updated successfully!");
    }
  };

  return (
    <>
      <Navbar />
      <div className="competition-view">
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
                      <th>Putts</th>
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
                            onChange={(e) =>
                              handleScoreEdit(index, e.target.value)
                            }
                          />
                        </td>
                        <td className="table-cell">
                          <input
                            type="number"
                            value={game.putts}
                            onChange={(e) =>
                              handlePuttsEdit(index, e.target.value)
                            }
                          />
                        </td>
                        <td>
                          <button onClick={() => handleSaveGame(index)}>
                            Save
                          </button>
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

export default CompetitionView;
