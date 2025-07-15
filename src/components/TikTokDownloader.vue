<template>
  <div class="w-full max-w-xl bg-white/10 p-6 rounded-2xl shadow-xl backdrop-blur-md">
    <h1 class="text-3xl font-bold text-center text-purple-400 mb-6">🎵 TikTok Downloader</h1>

    <input
      v-model="url"
      placeholder="Tempel link TikTok di sini..."
      class="w-full px-4 py-3 rounded-xl bg-black/60 text-white focus:outline-none focus:ring-2 ring-purple-500 placeholder-gray-400"
    />

    <button
      @click="download"
      :disabled="loading || !url"
      class="mt-4 w-full py-3 bg-purple-600 hover:bg-purple-700 transition rounded-xl text-white font-bold disabled:opacity-50"
    >
      {{ loading ? 'Menunggu...' : 'Unduh Sekarang' }}
    </button>

    <a
      href="https://kyluesky.netlify.app/tiktok"
      target="_blank"
      class="mt-3 block text-center text-sm text-blue-400 hover:underline"
    >
      Jika server ini error, gunakan website backup sementara
    </a>

    <div v-if="error" class="text-red-500 mt-4 text-center">{{ error }}</div>

    <div v-if="data" class="mt-6">
      <video class="rounded-xl w-full" controls :src="data.video"></video>
      <div class="mt-4 text-sm text-gray-300 space-y-1">
        <p>👤 <strong>{{ data.author.nickname }}</strong> (@{{ data.author.unique_id }})</p>
        <p>📝 {{ data.title }}</p>
      </div>

      <!-- Tombol download langsung -->
      <button
        @click="forceDownload"
        class="mt-4 w-full py-3 bg-green-600 hover:bg-green-700 text-white font-bold rounded-xl transition"
      >
        Download Video 🎬
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import axios from 'axios'

// State
const url = ref('')
const data = ref(null)
const loading = ref(false)
const error = ref('')

// Download dan ambil data dari TikWM
const download = async () => {
  error.value = ''
  data.value = null
  loading.value = true

  const finalUrl = url.value.trim()

  if (!finalUrl.includes('tiktok.com')) {
    error.value = 'Mohon masukkan URL TikTok yang valid.'
    loading.value = false
    return
  }

  try {
    const apiUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent(`https://tikwm.com/api?url=${finalUrl}&hd=1`)}`
    const res = await axios.get(apiUrl)

    if (res.data && res.data.data) {
      if (res.data.code === -1 && res.data.msg?.includes('Free Api Limit')) {
        error.value = 'Limit TikWM tercapai. Coba lagi dalam 1-2 detik.'
      } else {
        data.value = {
          video: res.data.data.play,
          title: res.data.data.title,
          author: {
            nickname: res.data.data.author.nickname,
            unique_id: res.data.data.author.unique_id
          }
        }
      }
    } else {
      error.value = 'Video tidak ditemukan atau link salah.'
    }
  } catch (err) {
    console.error('Proxy error:', err.message)
    error.value = 'Gagal mengambil data. Server mungkin sedang sibuk.'
  } finally {
    setTimeout(() => {
      loading.value = false
    }, 1500)
  }
}

// Paksa download dengan nama random
const forceDownload = () => {
  if (!data.value?.video) return
  const link = document.createElement('a')
  link.href = data.value.video

  // Nama acak contoh: tiktok-chisato-ABDJ63.mp4
  const random = Math.random().toString(36).substring(2, 8).toUpperCase()
  const filename = `tiktok-chisato-${random}.mp4`
  link.setAttribute('download', filename)

  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}
</script>
