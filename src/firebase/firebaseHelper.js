import { getDatabase, ref, set, get, child, update, remove } from "firebase/database";
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
