<template>
  <b-container class="mt-4">
    <!-- 🔹 Fil d'Ariane -->
    <b-breadcrumb class="mb-4">
      <b-breadcrumb-item to="/">Accueil</b-breadcrumb-item>
      <b-breadcrumb-item to="/discussions">Discussions</b-breadcrumb-item>
      <b-breadcrumb-item active>{{ discussion.title }}</b-breadcrumb-item>
    </b-breadcrumb>

    <!-- 🔹 Discussion principale -->
    <b-card class="mb-4 shadow-sm">
      <b-card-body>
        <h4 v-if="discussion" class="fw-bold text-primary mb-3">{{ discussion.title }}</h4>
        <p class="mb-3">{{ discussion.content }}</p>
        <div class="d-flex justify-content-between align-items-center">
          <small class="text-muted">
            <i class="fas fa-user me-1"></i> {{ discussion.authorName || 'Auteur inconnu' }} 
            | <i class="fas fa-folder ms-2 me-1"></i> {{ discussion.category || 'Non catégorisé' }}
            | <i class="fas fa-clock ms-2 me-1"></i> {{ formatDate(discussion.createdAt) }}
          </small>
          <b-badge variant="info">{{ replies.length }} réponse(s)</b-badge>
        </div>
        
        <!-- Actions Discussion -->
        <div class="d-flex justify-content-end mt-3 border-top pt-2" v-if="user">
          <b-button 
            v-if="isModerator" 
            variant="outline-danger" 
            size="sm" 
            class="me-2"
            @click="handleDeleteDiscussion"
          >
            <i class="fas fa-trash-alt me-2"></i>Supprimer
          </b-button>
          
          <b-button 
            variant="outline-warning" 
            size="sm"
            @click="handleReportDiscussion"
          >
            <i class="fas fa-flag me-2"></i>Signaler
          </b-button>
        </div>
      </b-card-body>
    </b-card>

    <!-- 🔹 Section réponse -->
    <div class="sticky-top bg-white py-3 shadow-sm mb-4" style="top: 56px; z-index: 1000;">
      <h5 class="mb-3"><i class="fas fa-reply me-2"></i>Répondre à cette discussion</h5>
      
      <!-- Si connecté -->
      <b-form @submit.prevent="submitReply" v-if="user">
        <b-form-textarea
          v-model="replyContent"
          rows="3"
          placeholder="Écrivez votre réponse ici..."
          required
          :disabled="isSubmitting"
          class="mb-3"
        />
        <div class="d-flex justify-content-between align-items-center">
          <small class="text-muted">Minimum 3 caractères</small>
          <b-button 
            type="submit" 
            variant="primary" 
            :disabled="!canSubmit"
            :class="{ 'opacity-50': !canSubmit }"
          >
            <span v-if="!isSubmitting">
              <i class="fas fa-paper-plane me-2"></i>Envoyer
            </span>
            <span v-else>
              <b-spinner small class="me-2"></b-spinner>Envoi en cours...
            </span>
          </b-button>
        </div>
      </b-form>
      
      <!-- Si non connecté -->
      <b-alert v-else show variant="warning" class="mb-0">
        <i class="fas fa-exclamation-triangle me-2"></i>
        <router-link to="/login" class="alert-link">Connectez-vous</router-link> pour répondre à cette discussion.
      </b-alert>
    </div>

    <!-- 🔹 Liste des réponses -->
    <div class="d-flex justify-content-between align-items-center mb-3">
      <h5 class="mb-0">
        <i class="fas fa-comments me-2"></i>Réponses ({{ replies.length }})
      </h5>
      <b-button 
        size="sm" 
        variant="outline-primary" 
        @click="refreshReplies"
        :disabled="isRefreshing"
      >
        <i class="fas fa-sync-alt" :class="{ 'fa-spin': isRefreshing }"></i>
        {{ isRefreshing ? 'Rafraîchissement...' : 'Rafraîchir' }}
      </b-button>
    </div>

    <!-- 🔹 Liste des réponses -->
    <div v-if="replies.length > 0">
      <ReplyCard
        v-for="r in replies"
        :key="r.id"
        :reply="r"
        :currentUser="user"
        @updateReply="handleUpdateReply"
        @deleteReply="handleDeleteReply"
        @reportReply="handleReportReply"
      />
    </div>

    <!-- 🔹 Message si aucune réponse -->
    <b-card v-else class="text-center py-5 border-dashed">
      <i class="fas fa-comment-slash fa-3x text-muted mb-3 opacity-50"></i>
      <h5 class="text-muted">Aucune réponse pour le moment</h5>
      <p class="text-muted mb-0">Soyez le premier à répondre !</p>
    </b-card>


  </b-container>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useUser } from '../composables/getUser.js'
import { getDiscussions, reportDiscussion, deleteDiscussion } from '../composables/useDiscussions.js'
import {
  listenReplies,
  addReply,
  updateReply,
  deleteReply,
  reportReply
} from '../composables/useReplies.js'
import ReplyCard from '../components/ReplyCard.vue'

const route = useRoute()
const router = useRouter()
const discussionId = computed(() => route.params.id)
const { user } = useUser()

const discussion = ref({
  id: null,
  title: '',
  content: '',
  authorName: '',
  category: '',
  createdAt: null
})

const replies = ref([])
const replyContent = ref('')
const isSubmitting = ref(false)
const isRefreshing = ref(false)
let unsubscribe = null

// Computed properties
const canSubmit = computed(() => {
  return user.value && 
         replyContent.value.trim().length >= 3 && 
         !isSubmitting.value
})

const isModerator = computed(() => {
  return user.value && user.value.role === 'moderator'
})

// 🔹 Charger la discussion
const fetchDiscussion = async () => {
  if (!discussionId.value) return

  try {
    console.log('Chargement discussion ID:', discussionId.value)
    const all = await getDiscussions()
    const found = all.find(d => d.id === discussionId.value)
    
    if (!found) {
      console.error('Discussion non trouvée:', discussionId.value)
      discussion.value = { title: 'Discussion non trouvée', content: '' }
      return
    }
    
    discussion.value = found
    console.log('Discussion chargée:', found)
  } catch (error) {
    console.error('Erreur lors du chargement de la discussion:', error)
    discussion.value = { title: 'Erreur de chargement', content: '' }
  }
}

// 🔹 Écouter les réponses en temps réel
const setupRealtimeReplies = () => {
  if (unsubscribe) {
    unsubscribe()
  }

  if (!discussionId.value) return
  
  console.log('Configuration écoute réponses pour:', discussionId.value)
  
  unsubscribe = listenReplies(discussionId.value, (data) => {
    console.log('Réponses reçues:', data.length)
    replies.value = data
    isRefreshing.value = false
  }, (error) => {
    console.error('Erreur realtime:', error)
    isRefreshing.value = false
    alert('Erreur de chargement des réponses.')
  })
}

// 🔹 Envoyer une réponse
const submitReply = async () => {
  if (!user.value) {
    alert('Vous devez être connecté pour répondre')
    return
  }
  
  const content = replyContent.value.trim()
  if (content.length < 3) {
    alert('Votre réponse doit contenir au moins 3 caractères')
    return
  }
  
  isSubmitting.value = true
  
  try {
    if (!discussionId.value) {
      throw new Error('ID de discussion manquant')
    }

    console.log('Envoi réponse avec:', {
      threadId: discussionId.value,
      authorId: user.value.uid,
      authorName: user.value.displayName || user.value.email,
      contentLength: content.length
    })
    
    const replyData = {
      threadId: discussionId.value,
      content: content,
      authorId: user.value.uid,
      authorName: user.value.displayName || user.value.email || 'Utilisateur',
      createdAt: new Date()
    }
    
    console.log('Données envoyées à addReply:', replyData)
    
    const result = await addReply(replyData)
    console.log('Réponse envoyée avec succès:', result)
    
    // Réinitialiser
    replyContent.value = ''
    
    // Petit feedback visuel
    const submitBtn = document.querySelector('[type="submit"]')
    if (submitBtn) {
      submitBtn.classList.add('btn-success')
      setTimeout(() => submitBtn.classList.remove('btn-success'), 1000)
    }
    
  } catch (error) {
    console.error('ERREUR complète:', error)
    console.error('Code:', error.code)
    console.error('Message:', error.message)
    console.error('Stack:', error.stack)
    
    let errorMessage = 'Erreur lors de l\'envoi de la réponse. '
    
    if (error.code === 'permission-denied') {
      errorMessage += 'Permission refusée. Vérifiez les règles Firestore.'
    } else if (error.code === 'unavailable') {
      errorMessage += 'Pas de connexion internet.'
    } else {
      errorMessage += `Détails: ${error.message || 'Erreur inconnue'}`
    }
    
    alert(errorMessage)
  } finally {
    isSubmitting.value = false
  }
}

// 🔹 Modifier une réponse
const handleUpdateReply = async (id, data) => {
  console.log('Modification réponse:', id, data)
  try {
    await updateReply(id, data)
    console.log('Réponse modifiée avec succès')
  } catch (error) {
    console.error('Erreur modification:', error)
    alert('Erreur lors de la modification: ' + error.message)
  }
}

// 🔹 Supprimer une réponse
const handleDeleteReply = async (id) => {
  console.log('Suppression réponse demandée:', id)
  if (confirm('Voulez-vous vraiment supprimer cette réponse ?')) {
    try {
      await deleteReply(id)
      console.log('Réponse supprimée avec succès')
    } catch (error) {
      console.error('Erreur suppression:', error)
      alert('Erreur lors de la suppression: ' + error.message)
    }
  }
}

// 🔹 Signaler une réponse
const handleReportReply = async (id) => {
  console.log('Signalement réponse:', id)
  if (confirm('Signaler cette réponse comme inappropriée ?')) {
    try {
      await reportReply(id)
      alert('La réponse a été signalée. Merci pour votre vigilance.')
    } catch (error) {
      console.error('Erreur signalement:', error)
      alert('Erreur lors du signalement: ' + error.message)
    }
  }
}



// 🔹 Supprimer la discussion (Modérateur)
const handleDeleteDiscussion = async () => {
  if (confirm('Êtes-vous sûr de vouloir supprimer cette discussion ? Cette action est irréversible.')) {
    try {
      await deleteDiscussion(discussionId.value)
      router.push('/discussions')
    } catch (error) {
      console.error('Erreur suppression discussion:', error)
      alert('Erreur: ' + error.message)
    }
  }
}

// 🔹 Signaler la discussion
const handleReportDiscussion = async () => {
  if (confirm('Voulez-vous signaler cette discussion comme inappropriée ?')) {
    try {
      await reportDiscussion(discussionId.value)
      alert('Discussion signalée. Merci.')
    } catch (error) {
      console.error('Erreur signalement discussion:', error)
      alert('Erreur: ' + error.message)
    }
  }
}

// 🔹 Rafraîchir les réponses
const refreshReplies = () => {
  console.log('Rafraîchissement manuel des réponses')
  isRefreshing.value = true
  setupRealtimeReplies()
  
  // Sécurité : forcer l'arrêt du spinner après 5s
  setTimeout(() => {
    if (isRefreshing.value) {
      console.warn('Timeout rafraîchissement')
      isRefreshing.value = false
    }
  }, 5000)
}

// 🔹 Formater la date
const formatDate = (timestamp) => {
  if (!timestamp) return 'Date inconnue'
  
  try {
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp)
    return date.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  } catch (error) {
    return 'Date invalide'
  }
}

// 🔹 Initialisation
onMounted(async () => {
  console.log('DiscussionDetails monté, ID:', discussionId.value)
  await fetchDiscussion()
  setupRealtimeReplies()
})

// 🔹 Surveiller les changements de route (navigation entre discussions)
watch(discussionId, async (newId) => {
  if (newId) {
    console.log('Changement de discussion:', newId)
    await fetchDiscussion()
    setupRealtimeReplies()
  }
})

// 🔹 Nettoyage
onUnmounted(() => {
  console.log('DiscussionDetails démonté')
  if (unsubscribe) {
    unsubscribe()
  }
})
</script>

<style scoped>
.opacity-50 {
  opacity: 0.5;
}

.border-dashed {
  border: 2px dashed #dee2e6;
}

.sticky-top {
  background-color: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
}

.btn-success {
  background-color: #28a745;
  border-color: #28a745;
}

pre {
  white-space: pre-wrap;
  word-wrap: break-word;
  font-family: 'Courier New', monospace;
  font-size: 12px;
}
</style>