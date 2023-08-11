const mongoose = require('mongoose')

const url = `mongodb+srv://${process.env.USERNAME_DB}:${process.env.PASSWORD_DB}@cluster0.zsx8h5v.mongodb.net/`

// console.log(url)
mongoose.connect(url)
.then(()=>{
    console.log("Base de datos MongoDB conectada")
})
.catch((error)=>{
console.error(error)
})

module.exports = mongoose