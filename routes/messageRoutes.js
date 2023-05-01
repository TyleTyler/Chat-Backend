const express = require('express')
const router = express.Router()
const requireAuth = require("../middleWar/useAuth")
const {sendMessage, getChatMessages} = require("../controllers/messageController")

router.post("/", (req, res)=> sendMessage(req, res))

router.get("/:chatID", (req,res)=> getChatMessages(req, res))



module.exports = router