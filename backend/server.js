import compression from 'compression'
import express, { request } from 'express'
import multer from 'multer'
import axios from 'axios'
import cors from 'cors'

const PORT = 1212
const app = express()

app.use(cors())
app.use(compression())

const corsOptions = { origin: 'http://localhost:8000', credentials: true }

app.get('/searchSuggestions', cors(corsOptions), async (req, res) => {
  const language = req.query.lang
  const query = req.query.query

  // if (language || query) {
  //     res.status(400).json({})
  //     return
  // }

  const requestEndPoint = `http://clients1.google.com/complete/search?hl=${language}&output=firefox&q=${query}`
  const response = await axios.get(requestEndPoint, { headers: { 'Content-Type': 'application/json' } })
  console.log('Client asked for suggestions')
  res.json(response.data[1])
})

const storage = multer.memoryStorage()
const upload = multer({ storage: storage })

app.post('/reverseSearchLink', upload.single('image'), cors(corsOptions), async (req, res) => {
  if (!req.file) return res.status(400).send('No file uploaded')

  const byteCharacters = atob(req.file.buffer.toString('base64'))
  const byteNumbers = new Array(byteCharacters.length)
  for (let i = 0; i < byteCharacters.length; i++) {
    byteNumbers[i] = byteCharacters.charCodeAt(i)
  }
  const byteArray = new Uint8Array(byteNumbers)

  const fileName = req.file.originalname
  const mimeType = req.file.mimetype
  const image = new File([byteArray], fileName, { type: mimeType })

  try {
    let multipart = new FormData()
    multipart.append('encoded_image', image)

    const response = await axios.post('https://lens.google.com/v3/upload', multipart, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:134.0) Gecko/20100101 Firefox/134.0',
        'Content-Type': 'multipart/form-data',
      },
      maxRedirects: 0,
      validateStatus: (status) => {
        return status === 303 || (status >= 200 && status < 300)
      },
    })

    if (response.status !== 303) throw new Error("Cannot get location header. Code isn't 303")

    const locationHeader = response.headers['location']
    if (!locationHeader) throw new Error("There's no location headers")

    res.status(200).send(locationHeader)
  } catch (error) {
    console.error(`Error making post request: ${error}`)
    res.status(500).send('An error occured while making post request')
  }
})

app.listen(PORT, () => {
  console.log(`Starting Listening on port: ${PORT}`)
})
