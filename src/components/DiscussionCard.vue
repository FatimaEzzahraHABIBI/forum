<template>
  <b-card class="mb-3">
    <h5>{{ discussion.title }}</h5>
    <p>{{ discussion.content.substring(0, 100) }}...</p>
    <small class="text-muted">
      Auteur: {{ discussion.authorName }} | Catégorie: {{ discussion.category }}
    </small>
    <b-button variant="primary" class="mt-2" @click="$router.push(`/discussion/${discussion.id}`)">
      Voir la discussion
    </b-button>
  </b-card>
</template>

<script setup>
defineProps({ discussion: Object })
</script>
