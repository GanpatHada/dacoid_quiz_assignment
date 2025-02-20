import initDB from "../utils/indexedDb"
import { v4 as uniqueId } from "uuid";



export const addQuizAttempt=async(attemptHistory:boolean[]):Promise<void>=>{
   const db=await initDB();
   const tx = db.transaction('QUIZ_ATTEMPTS', "readwrite");
   const store = tx.objectStore('QUIZ_ATTEMPTS');

  const newEntry = {
    uniqueId: uniqueId(), 
    attemptHistory,
    time:Date.now(),

  };

  await store.add(newEntry);
  await tx.done;
}



export const getAllQuizAttempts = async () => {
    const db = await initDB();
    return await db.getAll('QUIZ_ATTEMPTS') || [];
  };