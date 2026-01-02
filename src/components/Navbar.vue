<template>
  <b-navbar type="dark" variant="primary">
    <b-navbar-brand @click="$router.push('/')">Forum Communautaire</b-navbar-brand>

    <b-navbar-nav class="ms-auto">
      <b-nav-item v-if="!user" @click="$router.push('/login')">Login</b-nav-item>
      <b-nav-item v-if="!user" @click="$router.push('/signup')">Signup</b-nav-item>
      <b-nav-item v-if="user" @click="$router.push('/profile')">Profil</b-nav-item>
      <b-nav-item v-if="user && isModerator" @click="$router.push('/moderation')">Modération</b-nav-item>
      <b-nav-item v-if="user" @click="handleLogout">Déconnexion</b-nav-item>
    </b-navbar-nav>
  </b-navbar>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { auth } from '../firebase.js'
import { signOut } from 'firebase/auth'
import { useUser } from '../composables/getUser.js'

const { user } = useUser()
const isModerator = ref(false)

onMounted(async () => {
  if (user.value) {
    // Vérifie le rôle du modérateur
    const role = user.value.role || 'user'
    isModerator.value = role === 'moderator'
  }
})

const handleLogout = async () => {
  try {
    await signOut(auth)
    alert('Déconnecté avec succès')
  } catch (err) {
    console.error('Erreur logout:', err)
    alert('Impossible de se déconnecter')
  }
}
</script>
