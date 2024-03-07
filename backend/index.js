const connectToMongo = require('./db');
const express = require('express')
var cors = require('cors') 

connectToMongo();
const app = express()
const port = 5000

app.use(cors())
app.use(express.json())

// Available Routes
app.use('/auth', require('./routes/teachAuth'))
app.use('/studs', require('./routes/students'))
app.use('/result', require('./routes/studR'))


app.listen(port, () => {
  console.log(`server listening at http://localhost:${port}`)
})