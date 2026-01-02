import { db } from '../firebase'
import { doc, deleteDoc } from 'firebase/firestore'

export const deleteMessage = (collectionName, id) =>
  deleteDoc(doc(db, collectionName, id))
