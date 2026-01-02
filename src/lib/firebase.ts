import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getMessaging, getToken, onMessage } from "firebase/messaging";
import { getAnalytics, isSupported as isAnalyticsSupported } from "firebase/analytics";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID,
    measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize services conditionally (SSR safety / Browser check)
let messaging: any = null;
let analytics: any = null;

if (typeof window !== "undefined") {
    // Initialize Analytics
    isAnalyticsSupported().then((supported) => {
        if (supported) {
            analytics = getAnalytics(app);
        }
    });

    // Initialize Messaging
    try {
        messaging = getMessaging(app);
    } catch (e) {
        console.warn("Firebase Messaging failed to initialize", e);
    }
}

// Initialize Auth
const auth = getAuth(app);

export { app, messaging, analytics, auth, getToken, onMessage };
