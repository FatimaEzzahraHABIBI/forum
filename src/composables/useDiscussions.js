import { db } from '../firebase.js'
import { collection, addDoc, getDocs, doc, updateDoc } from 'firebase/firestore'

const discussionsCol = collection(db, 'discussions')

export const getDiscussions = async () => {
  const snap = await getDocs(discussionsCol)
  return snap.docs.map(d => ({ id: d.id, ...d.data() }))
}

export const createDiscussion = async (data) => {
  await addDoc(discussionsCol, { ...data, createdAt: new Date(), updatedAt: null, reported: false })
}

export const updateDiscussion = async (id, data) => {
  const refDoc = doc(db, 'discussions', id)
  await updateDoc(refDoc, { ...data, updatedAt: new Date() })
}

export const reportDiscussion = async (id) => {
  const refDoc = doc(db, 'discussions', id)
  await updateDoc(refDoc, { reported: true })
}

export const deleteDiscussion = async (id) => {
  const refDoc = doc(db, 'discussions', id)
  await refDoc.delete()
}
