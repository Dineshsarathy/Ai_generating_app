import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, FacebookAuthProvider } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyDQ4j28F3PFPhGq-KuFsj4P43rRMqDm-FM",
    authDomain: "gen-ai-2fcb4.firebaseapp.com",
    projectId: "gen-ai-2fcb4",
    storageBucket: "gen-ai-2fcb4.firebasestorage.app",
    messagingSenderId: "560480505634",
    appId: "1:560480505634:web:a14fa8d196549f787f5f7b",
    measurementId: "G-26137MTBT1"
  };

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
const facebookProvider = new FacebookAuthProvider();

export { auth, provider, facebookProvider };
