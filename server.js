require("dotenv").config()

const mongoose = require('mongoose')
const express = require("express")
const app = express()
const userRoutes = require("./routes/userRoutes")


//*Setting up DB and port connection 
app.use(express.json())
app.use(express.urlencoded({extended:true}))
mongoose.set('strictQuery', true);
mongoose.connect(process.env.DBURI, ()=>{
    app.listen(process.env.PORT, ()=>{
        console.log('Listening')
    })
})

app.use("/chatAPI/user/", userRoutes )