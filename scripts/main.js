import { initializeApp } from "https://www.gstatic.com/firebasejs/12.14.0/firebase-app.js";

import {
  getDatabase,
  ref,
  set
} from "https://www.gstatic.com/firebasejs/12.14.0/firebase-database.js";

const firebaseConfig = {
  apiKey: "AIzaSyDYs15sK52OqKc4zJzSbdM_q_p9kAp9i4k",
  authDomain: "join-4ac70.firebaseapp.com",
  databaseURL: "https://join-4ac70-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "join-4ac70",
  storageBucket: "join-4ac70.firebasestorage.app",
  messagingSenderId: "214911005553",
  appId: "1:214911005553:web:237dba08fb198a8e8bfcd0"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

async function start() {
  try {
    await set(ref(db, "test/message"), {
      text: "Firebase funktioniert",
      createdAt: new Date().toISOString()
    });

    console.log("Testdaten gespeichert");
  } catch (error) {
    console.error("Fehler beim Speichern:", error);
  }
}

start();
