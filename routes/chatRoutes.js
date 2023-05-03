const express = require('express')
const router = express.Router()
const requireAuth = require("../middleWar/useAuth")
const {accessChats, fetchChats, creatGroupChat, renameChat, addUser} = require("../controllers/chatController")

router.post("/", (req, res)=> accessChats(req, res))

router.post("/getChats", (req, res)=> fetchChats(req, res))

router.post("/createGC", (req, res)=>creatGroupChat(req, res))

router.post("/renameGC", (req, res)=> renameChat(req,res))

router.post("addUser", (req,res)=>addUser(req, res))



module.exports = router