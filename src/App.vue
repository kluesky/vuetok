<template>
  <main class="min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-gray-900 to-gray-950 text-white px-4">
    <TikTokDownloader />
  </main>
</template>

<script setup>
import TikTokDownloader from './components/TikTokDownloader.vue'
</script>

<style scoped>
/* Opsional: efek glow di sekeliling */
main {
  animation: fadeIn 0.6s ease-in;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
