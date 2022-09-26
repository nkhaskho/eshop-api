const express = require('express')
const connect = require('./config/db')

// .env config
require('dotenv').config();


const app = express()
const PORT = process.env.PORT || 3000

// connect to database
connect();

app.get('/status', (req, res) => {
    res.json({ status: 'active'})
})

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`)
})