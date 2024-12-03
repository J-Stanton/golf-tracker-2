import { getDatabase, ref, set, get, child, update, remove, query, limitToLast, orderByKey } from "firebase/database";
import db from "./firebase";

export const getAllHandicapMembers = async () =>{
    const dbRef = ref(db,'handicapMembers/');
    const snapshot = await get(dbRef);
    if (snapshot.exists()){
        return snapshot.val();
    }
    else{
        return {};
    }
};

export const getAllCompMembers = async () =>{
    const dbRef = ref(db,'competitionMembers/');
    const snapshot = await get(dbRef);
    if (snapshot.exists()){
        return snapshot.val();
    }
    else{
        return {};
    }
};

export const saveHandicapScores = ({ scores, date }) => {
    const formattedDate = date.toISOString().split("T")[0]; // Format date as YYYY-MM-DD
  
    const updates = {};
    for (const [playerIndex, score] of Object.entries(scores)) {
      // Construct the path using nested keys
      updates[`handicapScores/${playerIndex}/${formattedDate}`] = score;
    }
  
    // Update the database with the nested paths
    const dbRef = ref(db);
    update(dbRef, updates)
      .then(() => {
        console.log("Scores saved successfully");
      })
      .catch((error) => {
        console.error("Error saving scores:", error);
      });
};

export const getHandicapScores = async (memberId) =>{
  try {
    // Use query to order games by date (key) and limit to last 10
    const gamesRef = ref(db, `handicapScores/${memberId}`);
    const gamesQuery = query(gamesRef, orderByKey(), limitToLast(10));
    const snapshot = await get(gamesQuery);

    if (snapshot.exists()) {
      const games = snapshot.val();
      // Convert object to array and sort by date descending
      return Object.entries(games)
        .map(([date, score]) => ({ date, score }))
        .sort((a, b) => new Date(b.date) - new Date(a.date));
    }

    return [];
  } catch (error) {
    console.error("Error fetching member games:", error);
    return [];
  }  
}

export const updateHandicapScore = async (memberId, date, newScore) =>{
  const scoreRef = ref(db, `handicapScores/${memberId}/${date}`);
  await set(scoreRef, newScore);
}
