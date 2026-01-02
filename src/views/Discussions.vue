<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useRoute } from 'vue-router'
import { useUser } from '../composables/getUser.js'
import { getDiscussions } from '../composables/useDiscussions.js'
import {
  listenReplies,
  addReply,
  updateReply,
  deleteReply,
  reportReply
} from '../composables/useReplies.js'
import ReplyCard from '../components/ReplyCard.vue'

const route = useRoute()
const { user } = useUser()
const discussionId = route.params.id

const discussion = ref({})
const replies = ref([])
const replyContent = ref('')
let unsubscribe = null

onMounted(async () => {
  const all = await getDiscussions()
  discussion.value = all.find(d => d.id === discussionId)

  unsubscribe = listenReplies(discussionId, (data) => {
    replies.value = data
  })
})

onUnmounted(() => unsubscribe && unsubscribe())

const submitReply = async () => {
  if (!user.value || !replyContent.value.trim()) return

  await addReply({
    threadId: discussionId,
    content: replyContent.value,
    authorId: user.value.uid,
    authorName: user.value.displayName || user.value.email
  })
  replyContent.value = ''
}

const handleUpdateReply = async (id, content) => {
  await updateReply(id, content)
}

const handleDeleteReply = async (id) => {
  if (confirm('Supprimer cette réponse ?')) {
    await deleteReply(id)
  }
}

const handleReportReply = async (id) => {
  await reportReply(id)
  alert('Réponse signalée')
}
</script>
