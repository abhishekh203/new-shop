// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyAq-PKlfU17dvRK30Vj450dIKyG1qLkBkc",
  authDomain: "mye-com-d2101.firebaseapp.com",
  projectId: "mye-com-d2101",
  storageBucket: "mye-com-d2101.appspot.com",
  messagingSenderId: "297297615126",
  appId: "1:297297615126:web:62c237fcff6908fb03d837"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const fireDB=getFirestore(app);
const auth=getAuth(app);


export{auth, fireDB};
