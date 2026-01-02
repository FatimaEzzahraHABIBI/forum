<template>
  <div id="app">
    <Navbar />
    <router-view />
    <footer class="footer mt-4">
      &copy; 2026 Forum Communautaire. Tous droits réservés.
    </footer>
  </div>
</template>

<script setup>
import Navbar from './components/Navbar.vue'
</script>

<style>
/* Optionnel : styles globaux du footer */
.footer {
  background-color: #e9f2ff;
  padding: 1rem 0;
  text-align: center;
  color: #084298;
  font-weight: 500;
  border-top: 1px solid #d6e4ff;
}
</style>
