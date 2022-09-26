const express = require('express')

const app = express()
const PORT = process.env.PORT || 3000

app.get('/status', (req, res) => {
    res.json({ status: 'active'})
})

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`)
})