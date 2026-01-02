<template>
  <b-container class="mt-4 profile-box">
    <b-card>
      <h4>Mon Profil</h4>
      <p><strong>Nom :</strong> {{ user.displayName }}</p>
      <p><strong>Email :</strong> {{ user.email }}</p>
      <b-form @submit.prevent="updateProfileInfo">
        <b-form-group label="Changer le nom">
          <b-form-input v-model="newName" />
        </b-form-group>
        <b-button type="submit" variant="primary">Mettre à jour</b-button>
      </b-form>
    </b-card>
  </b-container>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { auth, db } from '../firebase'
import { doc, getDoc, updateDoc } from 'firebase/firestore'
import { updateProfile } from 'firebase/auth'

const user = ref({})
const newName = ref('')

const fetchUser = async () => {
  const snap = await getDoc(doc(db, 'users', auth.currentUser.uid))
  user.value = snap.data()
  newName.value = user.value.displayName
}

const updateProfileInfo = async () => {
  await updateProfile(auth.currentUser, { displayName: newName.value })
  await updateDoc(doc(db, 'users', auth.currentUser.uid), { displayName: newName.value })
  alert('Profil mis à jour')
  fetchUser()
}

onMounted(fetchUser)
</script>
