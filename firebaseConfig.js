import { initializeApp } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyAe5G49BmwsX3JJ2pY7Kp1ZQq9lY5NyMig",
  authDomain: "mad-ca3-4e330.firebaseapp.com",
  projectId: "mad-ca3-4e330",
  storageBucket: "mad-ca3-4e330.appspot.com",
  messagingSenderId: "60590072591",
  appId: "1:60590072591:web:b899f230d1d307da0ad47a",
  measurementId: "G-VT05M14RX4"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const auth = getAuth(app);
export const db = getFirestore(app);