import firebase from 'firebase/compat/app'
import 'firebase/compat/auth';
import 'firebase/compat/firestore'

const firebaseConfig2 = {
    apiKey: "AIzaSyAe5G49BmwsX3JJ2pY7Kp1ZQq9lY5NyMig",
    authDomain: "mad-ca3-4e330.firebaseapp.com",
    projectId: "mad-ca3-4e330",
    storageBucket: "mad-ca3-4e330.appspot.com",
    messagingSenderId: "60590072591",
    appId: "1:60590072591:web:b899f230d1d307da0ad47a",
    measurementId: "G-VT05M14RX4"
}

if (!firebase.apps.length){
    firebase.initializeApp(firebaseConfig2)
}

export {firebase };