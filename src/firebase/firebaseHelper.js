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

