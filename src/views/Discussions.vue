<template>
  <b-container class="mt-4">
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h2 class="mb-0">
        <i class="fas fa-comments text-primary me-2"></i>Toutes les discussions
      </h2>
      <b-button variant="primary" to="/create">
        <i class="fas fa-plus me-2"></i>Nouvelle Discussion
      </b-button>
    </div>

    <!-- 🔹 Filtres et Recherche -->
    <b-card class="mb-4 shadow-sm border-0 bg-light">
      <b-row class="g-3">
        <!-- Recherche -->
        <b-col md="5">
          <b-input-group>
            <b-input-group-text class="bg-white border-end-0">
              <i class="fas fa-search text-muted"></i>
            </b-input-group-text>
            <b-form-input
              v-model="searchQuery"
              placeholder="Rechercher une discussion..."
              class="border-start-0 ps-0"
            ></b-form-input>
          </b-input-group>
        </b-col>
        
        <!-- Catégorie -->
        <b-col md="4">
          <b-form-select v-model="selectedCategory" class="form-select">
            <option value="">Toutes les catégories</option>
            <option value="General">Général</option>
            <option value="Question">Questions</option>
            <option value="Suggestion">Suggestions</option>
            <option value="Bug">Bugs</option>
          </b-form-select>
        </b-col>
        
        <!-- Tri -->
        <b-col md="3">
          <b-form-select v-model="sortBy" class="form-select">
            <option value="date_desc">Plus récents</option>
            <option value="date_asc">Plus anciens</option>
            <option value="title_asc">Titre (A-Z)</option>
          </b-form-select>
        </b-col>
      </b-row>
    </b-card>

    <!-- 🔹 Loader -->
    <div v-if="loading" class="text-center py-5">
      <b-spinner variant="primary" label="Chargement..."></b-spinner>
      <p class="mt-2 text-muted">Chargement des discussions...</p>
    </div>

    <!-- 🔹 Liste vide -->
    <b-alert v-else-if="filteredDiscussions.length === 0" show variant="info" class="text-center py-4">
      <i class="fas fa-info-circle fa-2x mb-3"></i>
      <h5>Aucune discussion trouvée</h5>
      <p>Essayez de modifier vos filtres ou lancez un nouveau sujet !</p>
      <b-button variant="primary" to="/create" class="mt-2">Créer une discussion</b-button>
    </b-alert>

    <!-- 🔹 Liste des discussions -->
    <div v-else class="discussion-list">
      <b-card 
        v-for="discussion in filteredDiscussions" 
        :key="discussion.id" 
        class="mb-3 hover-shadow transition-all"
        no-body
      >
        <b-card-body>
          <div class="d-flex justify-content-between align-items-start">
            <div class="flex-grow-1">
              <h5 class="mb-1">
                <router-link :to="'/discussions/' + discussion.id" class="text-decoration-none text-dark fw-bold stretched-link">
                  {{ discussion.title }}
                </router-link>
              </h5>
              <p class="text-muted mb-2 text-truncate" style="max-width: 800px;">
                {{ discussion.content.substring(0, 150) }}{{ discussion.content.length > 150 ? '...' : '' }}
              </p>
              
              <div class="d-flex align-items-center text-muted small">
                <span class="me-3">
                  <i class="fas fa-user-circle me-1"></i>
                  {{ discussion.authorName || 'Anonyme' }}
                </span>
                <span class="me-3">
                  <i class="fas fa-folder me-1"></i>
                  {{ discussion.category || 'Général' }}
                </span>
                <span>
                  <i class="fas fa-clock me-1"></i>
                  {{ formatDate(discussion.createdAt) }}
                </span>
              </div>
            </div>
            
            <div class="text-end ms-3 d-none d-md-block">
              <b-badge variant="light" class="text-dark border">
                <i class="fas fa-chevron-right"></i>
              </b-badge>
            </div>
          </div>
        </b-card-body>
      </b-card>
    </div>
  </b-container>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { getDiscussions } from '../composables/useDiscussions.js'

const discussions = ref([])
const loading = ref(true)

// État des filtres
const searchQuery = ref('')
const selectedCategory = ref('')
const sortBy = ref('date_desc')

const filteredDiscussions = computed(() => {
  let result = [...discussions.value]

  // 1. Filtrage par recherche
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    result = result.filter(d => 
      d.title.toLowerCase().includes(query) || 
      d.content.toLowerCase().includes(query)
    )
  }

  // 2. Filtrage par catégorie
  if (selectedCategory.value) {
    result = result.filter(d => d.category === selectedCategory.value)
  }

  // 3. Tri
  result.sort((a, b) => {
    switch (sortBy.value) {
      case 'date_desc':
        return (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0)
      case 'date_asc':
        return (a.createdAt?.seconds || 0) - (b.createdAt?.seconds || 0)
      case 'title_asc':
        return a.title.localeCompare(b.title)
      default:
        return 0
    }
  })

  return result
})

const formatDate = (timestamp) => {
  if (!timestamp) return 'Date inconnue'
  try {
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp)
    return date.toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    })
  } catch (e) {
    return 'Date inconnue'
  }
}

onMounted(async () => {
  try {
    const all = await getDiscussions()
    discussions.value = all
  } catch (error) {
    console.error('Erreur chargement discussions:', error)
  } finally {
    loading.value = false
  }
})
</script>

<style scoped>
.hover-shadow:hover {
  box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15) !important;
  transform: translateY(-2px);
}

.transition-all {
  transition: all 0.2s ease-in-out;
}

/* Stretched link fix for relative positioning if needed, 
   though Bootstrap handles it usually. 
   Making sure card-body is relative is good practice. */
.card-body {
  position: relative;
}
</style>
