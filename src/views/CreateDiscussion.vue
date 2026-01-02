<template>
  <b-container class="mt-4">
    <b-card title="Créer une discussion">
      <b-form @submit.prevent="handleSubmit">
        <b-form-group label="Titre">
          <b-form-input v-model="title" required />
        </b-form-group>

        <b-form-group label="Catégorie">
          <b-form-select v-model="category" :options="categories" />
        </b-form-group>

        <b-form-group label="Contenu">
          <b-form-textarea v-model="content" rows="5" required />
        </b-form-group>

        <b-button type="submit" variant="primary">Publier</b-button>
      </b-form>
    </b-card>
  </b-container>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { auth } from '../firebase.js'
import { createDiscussion } from '../composables/useDiscussions.js'

const router = useRouter()
const title = ref('')
const content = ref('')
const category = ref('')
const categories = [
  { value: '', text: 'Choisir une catégorie' },
  { value: 'Programmation', text: 'Programmation' },
  { value: 'Education', text: 'Education' },
  { value: 'Santé', text: 'Santé' }
]

const handleSubmit = async () => {
  if (!auth.currentUser) {
    alert('Vous devez être connecté')
    return
  }

  const id = await createDiscussion({
    title: title.value,
    content: content.value,
    category: category.value,
    authorId: auth.currentUser.uid,
    authorName: auth.currentUser.displayName || 'Utilisateur'
  })

  router.push(`/discussions/${id}`)
}

</script>
