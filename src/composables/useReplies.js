// src/composables/useReplies.js
import { db } from '../firebase.js'
import {
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  getDocs,
  onSnapshot,
  query,
  where,
  serverTimestamp
} from 'firebase/firestore'

const repliesCol = collection(db, 'reponses')

// 🔹 Récupérer les réponses signalées (Moderation)
export const getReportedReplies = async () => {
  const q = query(repliesCol, where('reported', '==', true))
  const snap = await getDocs(q)
  return snap.docs.map(d => ({ id: d.id, ...d.data() }))
}

// 🔹 Écoute temps réel
export const listenReplies = (threadId, callback, onError) => {
  const q = query(
    repliesCol,
    where('threadId', '==', threadId)
  )

  return onSnapshot(q, (snapshot) => {
    const data = snapshot.docs.map(d => ({
      id: d.id,
      ...d.data()
    })).sort((a, b) => {
      const dateA = a.createdAt?.toDate ? a.createdAt.toDate() : new Date(a.createdAt || 0)
      const dateB = b.createdAt?.toDate ? b.createdAt.toDate() : new Date(b.createdAt || 0)
      return dateA - dateB
    })
    callback(data)
  }, (error) => {
    console.error('Erreur écoute réponses:', error)
    if (onError) onError(error)
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
