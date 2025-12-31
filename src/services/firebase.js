// Firebase Configuration
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Debug: Vérifier si les variables d'environnement sont chargées
const apiKey = import.meta.env.VITE_FIREBASE_API_KEY;

if (!apiKey) {
  console.error("❌ ERREUR: Les variables d'environnement Firebase ne sont pas chargées!");
  console.error("Vérifiez que:");
  console.error("1. Le fichier .env existe à la RACINE du projet (même niveau que package.json)");
  console.error("2. Les variables commencent par VITE_");
  console.error("3. Vous avez redémarré le serveur après avoir créé/modifié .env");
  console.error("");
  console.error("Valeurs actuelles:", {
    VITE_FIREBASE_API_KEY: import.meta.env.VITE_FIREBASE_API_KEY || "NON DÉFINI",
    VITE_FIREBASE_AUTH_DOMAIN: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "NON DÉFINI",
    VITE_FIREBASE_PROJECT_ID: import.meta.env.VITE_FIREBASE_PROJECT_ID || "NON DÉFINI",
  });
}

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

// Initialize Firebase
let app;
let auth;
let db;

try {
  app = initializeApp(firebaseConfig);
  auth = getAuth(app);
  db = getFirestore(app);
  console.log("✅ Firebase initialisé avec succès");
} catch (error) {
  console.error("❌ Erreur d'initialisation Firebase:", error.message);
  console.error("Configuration utilisée:", firebaseConfig);
}

// Google Auth Provider
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
  prompt: "select_account",
});

export { auth, db };
export default app;
