<template>
  <b-card class="mb-2">
    <p v-if="!editMode">{{ reply.content }}</p>

    <b-form v-else @submit.prevent="handleUpdate">
      <b-form-textarea v-model="newContent" rows="2" />
      <b-button size="sm" type="submit">Save</b-button>
      <b-button size="sm" variant="secondary" @click="editMode=false">Cancel</b-button>
    </b-form>

    <small>{{ reply.authorName }}</small>

    <div v-if="currentUserId">
      <b-button
        v-if="isAuthor && !editMode"
        size="sm"
        variant="warning"
        @click="editMode = true"
      >Edit</b-button>

      <b-button
        v-if="isAuthor"
        size="sm"
        variant="danger"
        @click="$emit('deleteReply', reply.id)"
      >Delete</b-button>

      <b-button
        v-if="!isAuthor"
        size="sm"
        variant="secondary"
        @click="$emit('reportReply', reply.id)"
      >Report</b-button>
    </div>
  </b-card>
</template>
