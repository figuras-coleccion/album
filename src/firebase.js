import { initializeApp } from 'firebase/app'
import { getDatabase, ref, set, get, update } from 'firebase/database'
import {
  getAuth,
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendEmailVerification,
  sendPasswordResetEmail,
  signOut,
  updateProfile,
  reload,
  getIdToken,
  GoogleAuthProvider,
  signInWithPopup,
  reauthenticateWithPopup,
  reauthenticateWithCredential,
  EmailAuthProvider,
  getAdditionalUserInfo,
  deleteUser
} from 'firebase/auth'

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || 'AIzaSyBE5n9wUk5iK35xjxa7h8aSz1YbJ5676wI',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || 'panini2026-eliparck.firebaseapp.com',
  databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL || 'https://panini2026-eliparck-default-rtdb.firebaseio.com',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || 'panini2026-eliparck',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || 'panini2026-eliparck.firebasestorage.app',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '61312064063',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || '1:61312064063:web:6ca49ffe656bf546b6768a'
}

const app = initializeApp(firebaseConfig)
const db = getDatabase(app)
const auth = getAuth(app)
auth.languageCode = 'es'

const googleProvider = new GoogleAuthProvider()
googleProvider.setCustomParameters({
  prompt: 'select_account'
})

export {
  db,
  auth,
  googleProvider,
  ref,
  set,
  get,
  update,
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendEmailVerification,
  sendPasswordResetEmail,
  signOut,
  updateProfile,
  reload,
  getIdToken,
  signInWithPopup,
  reauthenticateWithPopup,
  reauthenticateWithCredential,
  EmailAuthProvider,
  getAdditionalUserInfo,
  deleteUser
}
