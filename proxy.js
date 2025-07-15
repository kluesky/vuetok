// proxy.js
import express from 'express'
import cors from 'cors'
import axios from 'axios'

const app = express()
const port = 3001 // Port proxy server

app.use(cors())

app.get('/api', async (req, res) => {
  const { url } = req.query

  if (!url) {
    return res.status(400).json({ error: true, message: 'Parameter URL tidak ditemukan.' })
  }

  try {
    const response = await axios.get('https://tikwm.com/api', {
      params: {
        url,
        hd: 1
      }
    })

    res.json(response.data)
  } catch (err) {
    console.error('Proxy Error:', err.message)
    res.status(500).json({ error: true, message: 'Gagal mengambil data dari TikWM.' })
  }
})

app.listen(port, () => {
  console.log(`✅ Proxy server aktif di http://localhost:${port}`)
})