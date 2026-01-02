// src/composables/useReplies.js
import { db } from '../firebase.js'
import {
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  query,
  where,
  orderBy,
  serverTimestamp
} from 'firebase/firestore'

const repliesCol = collection(db, 'reponses')

// 🔹 Écoute temps réel
export const listenReplies = (threadId, callback) => {
  const q = query(
    repliesCol,
    where('threadId', '==', threadId),
    orderBy('createdAt', 'asc')
  )

  return onSnapshot(q, (snapshot) => {
    const data = snapshot.docs.map(d => ({
      id: d.id,
      ...d.data()
    }))
    callback(data)
  })
}

// 🔹 Ajouter réponse
export const addReply = async (data) => {
  await addDoc(repliesCol, {
    threadId: data.threadId,
    content: data.content,
    authorId: data.authorId,
    authorName: data.authorName,
    createdAt: serverTimestamp(),
    updatedAt: null,
    reported: false
  })
}

// 🔹 Modifier réponse
export const updateReply = async (id, content) => {
  const refDoc = doc(db, 'reponses', id)
  await updateDoc(refDoc, {
    content,
    updatedAt: serverTimestamp()
  })
}

// 🔹 Supprimer réponse
export const deleteReply = async (id) => {
  await deleteDoc(doc(db, 'reponses', id))
}

// 🔹 Signaler
export const reportReply = async (id) => {
  await updateDoc(doc(db, 'reponses', id), {
    reported: true
  })
}
