import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyAvAOrsTyY0dG2wpACScYUa9A9daKnQikI",
  authDomain: "pinaffilatepro.firebaseapp.com",
  projectId: "pinaffilatepro",
  storageBucket: "pinaffilatepro.firebasestorage.app",
  messagingSenderId: "364300987749",
  appId: "1:364300987749:web:894743961ac6daf8a2458c",
  measurementId: "G-R479Y8KPQS"
};

const app = initializeApp(firebaseConfig);

// Initialize Analytics only on client side
let analytics;
if (typeof window !== 'undefined') {
  analytics = getAnalytics(app);
}

export default app;
