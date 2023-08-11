const express = require('express')
const app = express()
require('dotenv').config()
const cors = require('cors')
require('./db/mongodb')
const RutasAPI = require('./routes')

app.use(express.json())
app.use(cors())

app.get('/', (req,res) =>{
    res.send('Servidor vivo')
})

app.use('/api/v1', RutasAPI)

const PORT = process.env.PORT || 4003

app.listen(PORT, () =>{
    console.log(`Servidor conectado en puerto ${PORT}`)
})