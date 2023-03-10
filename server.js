require("dotenv").config()


const mongoose = require('mongoose')
const express = require("express")
const app = express()
const userRoutes = require("./routes/userRoutes")
const cors = require('cors')


//*Setting up DB and port connection 
app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(cors({
    origin: "*"
}))
mongoose.set('strictQuery', true);

mongoose.connect(process.env.DBURI).then(()=>{
    app.listen(process.env.PORT, ()=>{
        console.log('Listening')
    })
})



app.use("/chatAPI/user/", userRoutes )