import { auth } from '../firebase'
import { signInWithEmailAndPassword } from 'firebase/auth'

export const useLogin = (email, password) =>
  signInWithEmailAndPassword(auth, email, password)
