const express = require('express')
const connect = require('./config/db')
const users = require('./routes/users')
const products = require('./routes/products')
const orders = require('./routes/orders')
const auth = require('./routes/auth')
var cors = require('cors')

// swagger open api doc
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');

// .env config
require('dotenv').config();


const app = express()
const PORT = process.env.PORT || 3000

// connect to database
connect();

// cores middelware
app.use(cors())

app.use('/doc', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use(express.json());

app.use("/api", [auth, users, products, orders]);

app.get('/status', (req, res) => {
    res.json({ status: 'active'})
})

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`)
})