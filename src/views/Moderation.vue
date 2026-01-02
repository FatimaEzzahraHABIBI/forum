<template>
  <b-container class="mt-4">
    <h3 class="mb-4 text-primary"><i class="fas fa-gavel me-2"></i>Modération</h3>

    <b-card no-body>
      <b-tabs card>
        <!-- 🔹 Onglet Discussions Signalées -->
        <b-tab title="Discussions Signalées" active>
          <div v-if="loading" class="text-center py-4">
            <b-spinner variant="primary"></b-spinner>
          </div>
          
          <div v-else-if="reportedDiscussions.length === 0" class="text-center py-5 text-muted">
            <i class="fas fa-check-circle fa-3x mb-3 text-success"></i>
            <h5>Aucune discussion signalée</h5>
            <p>Tout est calme pour le moment.</p>
          </div>

          <div v-else>
            <b-card v-for="discussion in reportedDiscussions" :key="discussion.id" class="mb-3 border-danger">
              <template #header>
                <div class="d-flex justify-content-between align-items-center">
                  <span class="fw-bold text-danger">Signalé</span>
                  <small>{{ formatDate(discussion.createdAt) }}</small>
                </div>
              </template>
              
              <h5 class="fw-bold">{{ discussion.title }}</h5>
              <p>{{ discussion.content }}</p>
              <div class="small text-muted mb-3">
                Par: {{ discussion.authorName }} | ID: {{ discussion.id }}
              </div>

              <div class="d-flex gap-2">
                <b-button variant="success" size="sm" @click="clearDiscussionReport(discussion.id)">
                  <i class="fas fa-check me-2"></i>Conserver (Retirer signalement)
                </b-button>
                <b-button variant="danger" size="sm" @click="deleteAuthDiscussion(discussion.id)">
                  <i class="fas fa-trash me-2"></i>Supprimer
                </b-button>
                <b-button variant="outline-primary" size="sm" :to="'/discussions/' + discussion.id">
                  <i class="fas fa-eye me-2"></i>Voir
                </b-button>
              </div>
            </b-card>
          </div>
        </b-tab>

        <!-- 🔹 Onglet Réponses Signalées -->
        <b-tab title="Réponses Signalées">
          <div v-if="loadingReplies" class="text-center py-4">
            <b-spinner variant="primary"></b-spinner>
          </div>

          <div v-else-if="reportedReplies.length === 0" class="text-center py-5 text-muted">
            <i class="fas fa-check-circle fa-3x mb-3 text-success"></i>
            <h5>Aucune réponse signalée</h5>
          </div>

          <div v-else>
            <b-card v-for="reply in reportedReplies" :key="reply.id" class="mb-3 border-danger">
              <p class="mb-2">{{ reply.content }}</p>
              <div class="small text-muted mb-3">
                Par: {{ reply.authorName }} | Discussion ID: {{ reply.threadId }}
              </div>

              <div class="d-flex gap-2">
                <b-button variant="success" size="sm" @click="clearReplyReport(reply.id)">
                  <i class="fas fa-check me-2"></i>Conserver
                </b-button>
                <b-button variant="danger" size="sm" @click="deleteAuthReply(reply.id)">
                  <i class="fas fa-trash me-2"></i>Supprimer
                </b-button>
                <b-button variant="outline-primary" size="sm" :to="'/discussions/' + reply.threadId">
                  <i class="fas fa-eye me-2"></i>Voir Contexte
                </b-button>
              </div>
            </b-card>
          </div>
        </b-tab>
      </b-tabs>
    </b-card>
  </b-container>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { getDiscussions, deleteDiscussion, updateDiscussion } from '../composables/useDiscussions'
import { getReportedReplies, deleteReply, updateReply } from '../composables/useReplies'

const reportedDiscussions = ref([])
const reportedReplies = ref([])
const loading = ref(true)
const loadingReplies = ref(true)

// Charger les discussions signalées
const fetchReportedDiscussions = async () => {
  loading.value = true
  try {
    const all = await getDiscussions()
    reportedDiscussions.value = all.filter(d => d.reported === true)
  } catch (e) {
    console.error('Erreur discussions:', e)
  } finally {
    loading.value = false
  }
}

// Charger les réponses signalées
const fetchReportedReplies = async () => {
  loadingReplies.value = true
  try {
    const all = await getReportedReplies()
    reportedReplies.value = all
  } catch (e) {
    console.error('Erreur réponses:', e)
  } finally {
    loadingReplies.value = false
  }
}

// Actions Discussions
const clearDiscussionReport = async (id) => {
  if (confirm('Retirer le signalement et conserver la discussion ?')) {
    await updateDiscussion(id, { reported: false })
    fetchReportedDiscussions()
  }
}

const deleteAuthDiscussion = async (id) => {
  if (confirm('SUPPRIMER définitivement cette discussion ?')) {
    await deleteDiscussion(id)
    fetchReportedDiscussions()
  }
}

// Actions Réponses
const clearReplyReport = async (id) => {
  if (confirm('Retirer le signalement et conserver la réponse ?')) {
    await updateReply(id, { reported: false })
    fetchReportedReplies()
  }
}

const deleteAuthReply = async (id) => {
  if (confirm('SUPPRIMER définitivement cette réponse ?')) {
    await deleteReply(id)
    fetchReportedReplies()
  }
}

const formatDate = (timestamp) => {
  if (!timestamp) return 'Date inconnue'
  try {
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp)
    return date.toLocaleDateString()
  } catch (e) { return '' }
}

onMounted(() => {
  fetchReportedDiscussions()
  fetchReportedReplies()
})
</script>
