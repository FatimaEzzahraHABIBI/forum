<template>
  <b-card class="mb-3">
    <b-row>
      <!-- Catégorie -->
      <b-col md="4">
        <b-form-group label="Catégorie">
          <b-form-select
            v-model="filters.category"
            :options="categoryOptions"
            @change="emitFilters"
          />
        </b-form-group>
      </b-col>

      <!-- Date -->
      <b-col md="4">
        <b-form-group label="Date">
          <b-form-select
            v-model="filters.date"
            :options="dateOptions"
            @change="emitFilters"
          />
        </b-form-group>
      </b-col>

      <!-- Popularité -->
      <b-col md="4">
        <b-form-group label="Popularité">
          <b-form-select
            v-model="filters.popularity"
            :options="popularityOptions"
            @change="emitFilters"
          />
        </b-form-group>
      </b-col>
    </b-row>
  </b-card>
</template>

<script setup>
import { reactive, watch } from 'vue'

const filters = reactive({
  category: '',
  date: 'recent',      // 'recent' par défaut
  popularity: ''       // '' = pas de filtre
})

const categoryOptions = [
  { value: '', text: 'Toutes les catégories' },
  { value: 'Programmation', text: 'Programmation' },
  { value: 'Education', text: 'Education' },
  { value: 'Santé', text: 'Santé' }
]

const dateOptions = [
  { value: 'recent', text: 'Plus récentes' },
  { value: 'old', text: 'Plus anciennes' }
]

const popularityOptions = [
  { value: '', text: 'Toutes' },
  { value: 'popular', text: 'Les plus populaires' }
]

const emit = defineEmits(['updateFilters'])

// Émettre les filtres quand ils changent
const emitFilters = () => emit('updateFilters', { ...filters })

// Pour que tout changement reactive déclenche l'émission automatiquement
watch(filters, emitFilters, { deep: true })
</script>
