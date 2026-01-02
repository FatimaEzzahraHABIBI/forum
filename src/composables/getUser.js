// src/composables/getUser.js
import { ref } from 'vue'
import { auth, db } from '../firebase.js'
import { onAuthStateChanged } from 'firebase/auth'
import { doc, getDoc } from 'firebase/firestore'

export const useUser = () => {
  const user = ref(null)
  const loading = ref(true)

  onAuthStateChanged(auth, async (firebaseUser) => {
    console.log('État auth changé:', firebaseUser ? firebaseUser.uid : 'non connecté')

    if (firebaseUser) {
      try {
        const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid))
        if (userDoc.exists()) {
          const userData = userDoc.data()
          firebaseUser.role = userData.role || 'user'
          console.log('Rôle utilisateur chargé:', firebaseUser.role)
        } else {
          firebaseUser.role = 'user'
        }
      } catch (e) {
        console.error('Erreur chargement profil:', e)
        firebaseUser.role = 'user'
      }
      user.value = firebaseUser
    } else {
      user.value = null
    }

    loading.value = false
  })

  return { user, loading }
}