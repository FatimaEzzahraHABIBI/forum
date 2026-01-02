<template>
  <b-container class="mt-4">
    <h3>Modération des Discussions</h3>
    <b-row>
      <b-col cols="12" md="6" v-for="discussion in discussions" :key="discussion.id">
        <DiscussionCard :discussion="discussion">
          <template #actions>
            <b-button variant="danger" size="sm" @click="deleteDiscussionItem(discussion.id)">
              Supprimer
            </b-button>
          </template>
        </DiscussionCard>
      </b-col>
    </b-row>
  </b-container>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { getDiscussions, deleteDiscussion } from '../composables/useDiscussions'
import DiscussionCard from '../components/DiscussionCard.vue'

const discussions = ref([])

const fetchDiscussions = async () => {
  discussions.value = await getDiscussions()
}

const deleteDiscussionItem = async (id) => {
  if (confirm('Voulez-vous vraiment supprimer cette discussion ?')) {
    await deleteDiscussion(id)
    fetchDiscussions()
  }
}

onMounted(fetchDiscussions)
</script>
