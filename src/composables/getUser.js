// src/composables/getUser.js
import { ref } from 'vue'
import { auth } from '../firebase.js'
import { onAuthStateChanged } from 'firebase/auth'

export const useUser = () => {
  const user = ref(null)
  const loading = ref(true)

  onAuthStateChanged(auth, (firebaseUser) => {
    console.log('État auth changé:', firebaseUser ? firebaseUser.uid : 'non connecté')
    user.value = firebaseUser
    loading.value = false
  })

  return { user, loading }
}