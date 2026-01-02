<template>
  <b-card 
    no-body 
    class="mb-3 shadow-sm border-0 reply-card transition-all"
    :class="{ 'bg-light': isAuthor }"
  >
    <b-card-body class="p-3">
      <!-- Header: Auteur et Date -->
      <div class="d-flex justify-content-between align-items-center mb-2">
        <div class="d-flex align-items-center">
          <div class="avatar-placeholder me-2 bg-gradient-primary text-white rounded-circle d-flex align-items-center justify-content-center fw-bold shadow-sm" style="width: 32px; height: 32px; font-size: 0.8rem;">
            {{ getInitials(reply.authorName) }}
          </div>
          <div>
            <span class="fw-bold text-dark small">{{ reply.authorName }}</span>
            <span v-if="isAuthor" class="badge bg-primary ms-2" style="font-size: 0.65rem;">Moi</span>
          </div>
        </div>
        <small class="text-muted" style="font-size: 0.75rem;">
          <i class="fas fa-clock me-1"></i>
          {{ formatDate(reply.createdAt) }}
          <span v-if="reply.updatedAt" class="ms-1 fst-italic">(modifié)</span>
        </small>
      </div>

      <!-- Content -->
      <div v-if="!editMode" class="reply-content mb-2">
        <p class="mb-0 text-secondary" style="white-space: pre-wrap;">{{ reply.content }}</p>
      </div>

      <!-- Edit Form -->
      <b-form v-else @submit.prevent="saveEdit" class="mb-2">
        <b-form-textarea
          v-model="editedContent"
          rows="3"
          class="mb-2"
          placeholder="Modifiez votre réponse..."
          required
        ></b-form-textarea>
        <div class="d-flex gap-2">
          <b-button type="submit" variant="primary" size="sm" :disabled="isSaving">
            <b-spinner small v-if="isSaving"></b-spinner>
            {{ isSaving ? 'Enregistrement...' : 'Enregistrer' }}
          </b-button>
          <b-button variant="outline-secondary" size="sm" @click="cancelEdit" :disabled="isSaving">
            Annuler
          </b-button>
        </div>
      </b-form>

      <!-- Actions Footer -->
      <div class="d-flex justify-content-end gap-2 mt-2 pt-2 border-top border-light" v-if="!editMode && currentUser">
        <template v-if="isAuthor || isModerator">
          <b-button v-if="isAuthor"
            variant="link" 
            class="text-decoration-none text-muted p-0 px-1 small-btn" 
            @click="startEdit"
            title="Modifier"
          >
            <i class="fas fa-edit me-1"></i>Edit
          </b-button>
          <b-button 
            variant="link" 
            class="text-decoration-none text-danger p-0 px-1 small-btn" 
            @click="confirmDelete"
            title="Supprimer"
          >
            <i class="fas fa-trash-alt me-1"></i>Supprimer
          </b-button>
        </template>
        
        <b-button 
          v-else 
          variant="link" 
          class="text-decoration-none text-muted p-0 px-1 small-btn" 
          @click="$emit('reportReply', reply.id)"
          title="Signaler"
        >
          <i class="fas fa-flag me-1"></i>Signaler
        </b-button>
      </div>
    </b-card-body>
  </b-card>
</template>

<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  reply: {
    type: Object,
    required: true
  },
  currentUser: {
    type: Object,
    default: null
  }
})

const emit = defineEmits(['updateReply', 'deleteReply', 'reportReply'])

const editMode = ref(false)
const editedContent = ref('')
const isSaving = ref(false)

const isAuthor = computed(() => {
  return props.currentUser && props.reply.authorId === props.currentUser.uid
})

const isModerator = computed(() => {
  return props.currentUser && props.currentUser.role === 'moderator'
})

const getInitials = (name) => {
  return name ? name.substring(0, 2).toUpperCase() : '??'
}

const formatDate = (timestamp) => {
  if (!timestamp) return ''
  try {
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp)
    return date.toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    })
  } catch (e) {
    return ''
  }
}

const startEdit = () => {
  editedContent.value = props.reply.content
  editMode.value = true
}

const cancelEdit = () => {
  editMode.value = false
  editedContent.value = ''
}

const saveEdit = async () => {
  if (editedContent.value.trim() === props.reply.content) {
    cancelEdit()
    return
  }

  isSaving.value = true
  try {
    emit('updateReply', props.reply.id, editedContent.value)
    editMode.value = false
  } catch (error) {
    console.error('Error saving reply:', error)
  } finally {
    isSaving.value = false
  }
}

const confirmDelete = () => {
  emit('deleteReply', props.reply.id)
}
</script>

<style scoped>
.reply-card {
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.reply-card:hover {
  transform: translateY(-1px);
  box-shadow: 0 .5rem 1rem rgba(0,0,0,.08) !important;
}

.bg-gradient-primary {
  background: linear-gradient(45deg, #4f46e5, #818cf8);
}

.small-btn {
  font-size: 0.8rem;
  opacity: 0.7;
  transition: opacity 0.2s;
}

.small-btn:hover {
  opacity: 1;
}

/* Animations */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
