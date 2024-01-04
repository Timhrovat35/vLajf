import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

// Optionally import the services that you want to use
// import {...} from "firebase/auth";
// import {...} from "firebase/database";
// import {...} from "firebase/firestore";
// import {...} from "firebase/functions";
// import {...} from "firebase/storage";

// Initialize Firebase
const firebaseConfig = {
    apiKey: "AIzaSyAvsuRS5hUVwgiVrXgZyPrTQK61pFrxHMQ",
    authDomain: "vlajf-ad3b4.firebaseapp.com",
    databaseURL: "https://vlajf-ad3b4-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "vlajf-ad3b4",
    storageBucket: "vlajf-ad3b4.appspot.com",
    messagingSenderId: "410944438182",
    appId: "1:410944438182:web:ab33b316b711be88e41967",
    measurementId: "G-92T8P9D191"
  };

export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
// For more information on how to access Firebase in your project,
// see the Firebase documentation: https://firebase.google.com/docs/web/setup#access-firebase
