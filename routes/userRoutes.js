const express = require('express')
const { signup, login, getAll } = require('../controllers/userController')
const router = express.Router()

router.get("/", (req, res)=>{
    res.json( {body : "Recieved"})
})


//*Signup Route
router.post('/signup', (req,res) => signup(req, res))

//*Login Route
router.post('/login', (req, res) => login(req,res))

//*Route that returns all the users
router.get('/allUsers', (req,res) =>getAll(req, res))



module.exports = router