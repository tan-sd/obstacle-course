// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getDatabase, ref, set, push, get } from "firebase/database";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: import.meta.env.VITE_API_KEY,
    authDomain: import.meta.env.VITE_AUTH_DOMAIN,
    databaseURL: import.meta.env.VITE_DATABASE_URL,
    projectId: import.meta.env.VITE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_APP_ID,
    measurementId: import.meta.env.VITE_MEASUREMENT_ID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);
const analytics = getAnalytics(app);

// Push data to the database
export function pushData(name, score, date, time) {
    const scoresRef = ref(database, "scores");
    const newScoreRef = push(scoresRef);

    set(newScoreRef, {
        name: name,
        score: score,
        date: date,
        time: time,
    });
}

export async function getData() {
    const databaseRef = ref(database, "scores");
    try {
        const dataSnapshot = await get(databaseRef);
        if (dataSnapshot.exists()) {
            const data = dataSnapshot.val();
            return data;
        } else {
            return null;
        }
    } catch (error) {
        console.error("Error getting database data:", error);
        return null;
    }
}
