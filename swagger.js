const swaggerAutogen = require('swagger-autogen')()

const outputFile = './swagger.json'
const endpointsFiles = ["./routes/auth.js", "./routes/users.js", "./routes/products.js"]

const doc = {
    info: {
        version: "1.0.0",
        title: "E-Shop API",
        description: "The <b>E-Shop</b> API Documentation."
    },
    schemes: ['http'],
    host: `localhost:3000`,
    basePath: "/api",
}

swaggerAutogen(outputFile, endpointsFiles, doc).then(() => {
    require('./index.js');
})