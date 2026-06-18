const FIREBASE_CONFIG = {
  apiKey: "AIzaSyB8GBusdNT97-7n2WdRvRodMX6nya6UUOU",
  authDomain: "pesomasa-2b47f.firebaseapp.com",
  databaseURL: "https://pesomasa-2b47f-default-rtdb.firebaseio.com",
  projectId: "pesomasa-2b47f",
  storageBucket: "pesomasa-2b47f.firebasestorage.app",
  messagingSenderId: "204265729583",
  appId: "1:204265729583:web:de9e452e6950b1a82f60da"
};

firebase.initializeApp(FIREBASE_CONFIG);

const db = firebase.firestore();
const rtdb = firebase.database();

const ADMIN_PASSWORD = "papá2026";

const FB = {
  now: () => Date.now(),
  progressRef: () => db.collection("progress").doc("luanna"),
  configRef: () => db.collection("config").doc("phases"),
  historyCol: () => db.collection("history"),
  sessionsCol: () => db.collection("sessions"),
  liveRef: () => rtdb.ref("live/luanna")
};