<template>
  <b-container class="mt-4">
    <b-card title="Inscription">
      <b-form @submit.prevent="handleSignup">
        <b-form-group label="Nom">
          <b-form-input v-model="displayName" required />
        </b-form-group>

        <b-form-group label="Email">
          <b-form-input type="email" v-model="email" required />
        </b-form-group>

        <b-form-group label="Mot de passe">
          <b-form-input type="password" v-model="password" required />
        </b-form-group>

        <b-button type="submit" variant="primary">S'inscrire</b-button>
      </b-form>
    </b-card>
  </b-container>
</template>

<script setup>
import { ref } from 'vue'
import { useSignup } from '../composables/useSignup'
import { useRouter } from 'vue-router'

const displayName = ref('')
const email = ref('')
const password = ref('')
const router = useRouter()

const handleSignup = async () => {
  try {
    await useSignup(email.value, password.value, displayName.value)
    alert('Inscription réussie !')
    router.push('/discussions')
  } catch (err) {
    alert(err.message)
  }
}
</script>
