import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'


const firebaseConfig = {
apiKey: "AIzaSyB-w1OXhaj3AdVu09YHZTtoj7P0PQng25Y",
authDomain: "doctor-appointment-booki-6631d.firebaseapp.com",
projectId: "doctor-appointment-booki-6631d",
storageBucket: "doctor-appointment-booki-6631d.firebasestorage.app",
messagingSenderId: "94952104931",
appId: "1:94952104931:web:b896cf21062c33a5f636d6",
}


const app = initializeApp(firebaseConfig)
export const auth = getAuth(app)
export const db = getFirestore(app)