import { openDB } from "idb";

const DB_NAME = "QUIZ-APP";
const STORE_NAME = "QUIZ_ATTEMPTS";

const initDB = async () => {
  return openDB(DB_NAME, 1, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: "uniqueId" }); // Use UUID as keyPath
      }
    },
  });
};

export default initDB;
