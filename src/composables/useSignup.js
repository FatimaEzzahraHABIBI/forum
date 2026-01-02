import { auth, db } from '../firebase'
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth'
import { doc, setDoc, serverTimestamp } from 'firebase/firestore'

export const useSignup = async (email, password, displayName) => {
  const res = await createUserWithEmailAndPassword(auth, email, password)

  // Mettre à jour le nom d'affichage dans Firebase Auth
  await updateProfile(res.user, { displayName })

  // Créer le document user dans Firestore
  await setDoc(doc(db, 'users', res.user.uid), {
    uid: res.user.uid,
    displayName,
    email,
    photoURL: '',
    role: 'user',
    createdAt: serverTimestamp()
  })

  return res.user
}
