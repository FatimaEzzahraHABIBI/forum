<template>
  <b-container class="mt-4">
    <b-card title="Réinitialiser le mot de passe">
      <b-form @submit.prevent="handleReset">
        <b-form-group label="Email">
          <b-form-input type="email" v-model="email" required />
        </b-form-group>

        <b-button type="submit" variant="primary">Envoyer l'email</b-button>
      </b-form>
    </b-card>
  </b-container>
</template>

<script setup>
import { ref } from 'vue'
import { useResetPassword } from '../composables/useResetPassword'

const email = ref('')

const handleReset = async () => {
  try {
    await useResetPassword(email.value)
    alert('Email envoyé ! Vérifiez votre boîte de réception.')
  } catch (err) {
    alert(err.message)
  }
}
</script>
