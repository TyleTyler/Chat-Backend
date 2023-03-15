const express = require('express')
const router = express.Router()
const requireAuth = require("../middleWar/useAuth")
const {accessChats} = require("../controllers/messageController")

router.post("/", (req, res)=> accessChats(req, res))

module.exports = router