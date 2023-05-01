const express = require('express')
const { signup, login, getAll, sendFriendRequest, acceptRequest, removeFriend, getUser, rejectRequest, getUsers } = require('../controllers/userController')
const router = express.Router()
const requireAuth = require("../middleWar/useAuth")

router.get("/", (req, res)=>{
    res.json( {body : "Recieved"})
})



//*Signup Route
router.post('/signup', (req,res) => signup(req, res))

//*Login Route
router.post('/login', (req, res) => login(req,res))

//*Route that returns all the users
router.get('/allUsers', (req,res) =>getAll(req, res))

//*Route that returns a user
router.get("/getUser/:userID", (req, res) => getUser(req, res))


//*User Authtentication
// router.use(requireAuth)

router.get('/addFriend:email:friendcode', (req, res)=> addFriend(req, res))

//*Route that sends friend request
router.get('/sendRequest/:email/:friendcode', (req, res)=>sendFriendRequest(req, res))

//*Route that accepts a friend request
router.get('/acceptReq/:userID/:friendID', (req, res)=>acceptRequest(req, res))

//*Route that rejects a friend request
router.get('/rejectReq/:userID/:friendID', (req, res)=> rejectRequest(req, res))

//*Route that remove a friend
router.delete('/removeFriend/:userID/:friendID', (req, res)=> removeFriend(req, res))

//*Route that gets possible users
router.post('/getUsers', (req, res) => getUsers(req, res))

module.exports = router