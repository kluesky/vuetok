<template>
  <div class="w-full max-w-xl bg-white/10 p-6 rounded-2xl shadow-xl backdrop-blur-md">
    <h1 class="text-3xl font-bold text-center text-purple-400 mb-6">🎵 TikTok Downloader</h1>

    <!-- Input -->
    <input
      v-model="url"
      placeholder="Tempel link TikTok di sini..."
      class="w-full px-4 py-3 rounded-xl bg-black/60 text-white focus:outline-none focus:ring-2 ring-purple-500 placeholder-gray-400"
    />

    <!-- Tombol Download -->
    <button
      @click="download"
      :disabled="loading || !url"
      class="mt-4 w-full py-3 bg-purple-600 hover:bg-purple-700 transition rounded-xl text-white font-bold disabled:opacity-50"
    >
      {{ loading ? 'Memproses...' : 'Unduh Sekarang' }}
    </button>

    <!-- Error -->
    <div v-if="error" class="text-red-500 mt-4 text-center">{{ error }}</div>

    <!-- Hasil -->
    <div v-if="data" class="mt-6">
      <video
        class="rounded-xl w-full"
        controls
        :src="data.video"
      ></video>

      <div class="mt-4 text-sm text-gray-300 space-y-1">
        <p>👤 <strong>{{ data.author.nickname }}</strong> (@{{ data.author.unique_id }})</p>
        <p>📝 {{ data.title }}</p>
      </div>

      <a
        :href="data.video"
        download
        class="mt-4 inline-block bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl font-bold transition"
      >
        Download Video 🎬
      </a>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import axios from 'axios'

const url = ref('')
const data = ref(null)
const loading = ref(false)
const error = ref('')

const download = async () => {
  error.value = ''
  data.value = null
  loading.value = true

  try {
    const res = await axios.get('https://tikwm.com/api', {
      params: {
        url: url.value,
        hd: 1
      }
    })

    if (res.data && res.data.data) {
      data.value = {
        video: res.data.data.play, // video tanpa watermark
        title: res.data.data.title,
        author: {
          nickname: res.data.data.author.nickname,
          unique_id: res.data.data.author.unique_id
        }
      }
    } else {
      error.value = 'Video tidak ditemukan atau link salah.'
    }
  } catch (err) {
    error.value = 'Terjadi kesalahan saat mengambil data dari TikWM API.'
  } finally {
    loading.value = false
  }
}
</script>
