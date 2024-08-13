import { getAuth, signInWithPopup, GoogleAuthProvider, signOut } from "firebase/auth";
import { app } from "./firebaseConfig";

// Initialize Firebase Auth provider
const provider = new GoogleAuthProvider();

export const auth = getAuth();
export const signInWithGooglePopup = () => signInWithPopup(auth, provider);
export const logOut = () => signOut(auth)