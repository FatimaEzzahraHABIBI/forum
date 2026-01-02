import { auth } from '../firebase'
import { sendPasswordResetEmail } from 'firebase/auth'

export const useResetPassword = (email) =>
  sendPasswordResetEmail(auth, email)
