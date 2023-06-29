const express = require('express')
const mongoose = require('mongoose')
const router = require('./routes/route')
const app = express()

app.use(express.json())

mongoose.connect('mongodb+srv://tshivendra07:6sWDbb2xoYJ5IZ0N@cluster0.3dhywqg.mongodb.net/BookManagement?retryWrites=true&w=majority', {
    useNewUrlParser : true
}).then(() =>{
    console.log('Database Connected..')
}).catch((error) =>{
    console.log(error)
})


app.use('/', router)

const PORT = process.env.PORT || 3000

app.listen(PORT, () =>{
    console.log(`App is running on http://localhost:${PORT}`)
})
