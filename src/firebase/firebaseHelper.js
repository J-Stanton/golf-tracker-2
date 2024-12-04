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
    const formattedDate = date.toLocaleDateString("en-ZA", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).replace(/\//g, "-");
  
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

export const saveCompetitionScores = ({ scores, date }) => {
  const formattedDate = date.toLocaleDateString("en-ZA", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).replace(/\//g, "-");

  const updates = {};
  for (const [playerIndex, { score, putts }] of Object.entries(scores)) {
    // Construct the path using nested keys
    updates[`competitionScores/${playerIndex}/${formattedDate}`] = { score, putts };
  }

  // Update the database with the nested paths
  const dbRef = ref(db);
  update(dbRef, updates)
    .then(() => {
      console.log("Competition scores saved successfully");
    })
    .catch((error) => {
      console.error("Error saving competition scores:", error);
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


export const getCompetitionScores = async (memberId) => {
  const scoresRef = ref(db, `competitionScores/${memberId}`);
  const snapshot = await get(scoresRef);
  if (snapshot.exists()) {
    return snapshot.val();
  } else {
    return [];
  }
};

// Update competition score and putts for a member
export const updateCompetitionScore = async (memberId, date, { score, putts }) => {
  const updates = {};
  updates[`competitionScores/${memberId}/${date}/score`] = score;
  updates[`competitionScores/${memberId}/${date}/putts`] = putts;

  const dbRef = ref(db);
  try {
    await update(dbRef, updates);
    console.log("Competition scores updated successfully");
  } catch (error) {
    console.error("Error updating competition scores:", error);
  }
};

export const addHandicapMember = async (name) => {
  try {
    const membersRef = ref(db, "handicapMembers");
    const snapshot = await get(membersRef);
    const members = snapshot.exists() ? snapshot.val() : {};
    const nextIndex = Object.keys(members).length; // Calculate next index

    await set(ref(db, `handicapMembers/${nextIndex}`), { name });
    console.log("Handicap member added successfully with index:", nextIndex);
  } catch (error) {
    console.error("Error adding handicap member: ", error);
  }
};

export const addCompetitionMember = async (name) => {
  try {
    const membersRef = ref(db, "competitionMembers");
    const snapshot = await get(membersRef);
    const members = snapshot.exists() ? snapshot.val() : {};
    const nextIndex = Object.keys(members).length; // Calculate next index

    await set(ref(db, `competitionMembers/${nextIndex}`), { name });
    console.log("Competition member added successfully with index:", nextIndex);
  } catch (error) {
    console.error("Error adding competition member: ", error);
  }
};