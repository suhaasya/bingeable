// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app"
import { getAnalytics } from "firebase/analytics"
import {
  collection,
  doc,
  getDocs,
  getFirestore,
  limit,
  query,
  where,
} from "firebase/firestore"
import { getAuth } from "firebase/auth"
import { getStorage } from "firebase/storage"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyB4ZBzY9A44kuiKOxCPDveXFTDwLyTBsBI",
  authDomain: "bingeable-266e7.firebaseapp.com",
  projectId: "bingeable-266e7",
  storageBucket: "bingeable-266e7.appspot.com",
  messagingSenderId: "121274786960",
  appId: "1:121274786960:web:de0c1d7fb1ca93a615e415",
  measurementId: "G-NYQ3G7QD3T",
}

// Initialize Firebase
export const app = initializeApp(firebaseConfig)

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app)
export const auth = getAuth()
export const storage = getStorage(app)
/// Helper Functions
export async function getUserWithUsername(username) {
  const usersRef = collection(db, "users")
  const q = query(usersRef, where("username", "==", username))
  const userDoc = (await getDocs(q)).docs[0]
  return userDoc
}

export function postToJSON(doc) {
  const data = doc.data()
  return {
    ...data,
    // Gotcha! firestore timestamp NOT serializable to JSON. Must convert to milliseconds
    createdAt: data?.createdAt.toMillis() || 0,
    updatedAt: data?.updatedAt.toMillis() || 0,
  }
}
