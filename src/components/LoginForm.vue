<template>
  <b-container class="mt-4">
    <b-card title="Connexion">
      <b-form @submit.prevent="handleLogin">
        <b-form-group label="Email">
          <b-form-input type="email" v-model="email" required />
        </b-form-group>

        <b-form-group label="Mot de passe">
          <b-form-input type="password" v-model="password" required />
        </b-form-group>

        <b-button type="submit" variant="primary">Se connecter</b-button>
        <b-button variant="link" @click="$router.push('/forgot-password')">Mot de passe oublié ?</b-button>
      </b-form>
    </b-card>
  </b-container>
</template>

<script setup>
import { ref } from 'vue'
import { useLogin } from '../composables/useLogin'
import { useRouter } from 'vue-router'

const email = ref('')
const password = ref('')
const router = useRouter()

const handleLogin = async () => {
  try {
    await useLogin(email.value, password.value)
    alert('Connexion réussie !')
    router.push('/discussions')
  } catch (err) {
    alert(err.message)
  }
}
</script>
