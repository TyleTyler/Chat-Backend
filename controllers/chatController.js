const Chat = require("../models/chatModel")


//*This route returns the chats between two people or creates one if it doesn't already exist
//?This route requires a userID and a friendID in the body
const accessChats = async (req, res)=>{
    const {userID, friendID} = req.body
    try{
        const accessedChat = await Chat.accessChats(userID, friendID)
        res.status(200).json({...accessedChat})
    }catch({message}){
        res.status(400).json({message})
    }
}

const fetchChats = async (req, res)=>{
   const {userID} = req.body
    try{
        const fetchedChat = await Chat.fetchChats(userID)
        res.status(200).json({...fetchedChat})
    }catch({message}){
        res.status(400).json({message})
    }
}

const creatGroupChat = async (req, res)=>{
    const {users, chatName} = req.body
    console.log(req.body)
    try{
        const groupChat = await Chat.createGroupChat(users, chatName)
        res.status(200).json({...groupChat})
    }catch({message}){
        res.status(400).json({message})
    }
}


const renameChat = async (req, res)=>{
    const {chatID, newName} = req.body
    try{
        const newChat = await Chat.renameChat(chatID, newName)
        const {_doc } = newChat
        res.status(200).json({..._doc})
    }catch({message}){
        res.status(400).json({message})
    }
}

const addUser = async (req, res)=>{
    const {chatID, userID} = req.body
    try{
        const addUser = await Chat.addUserToGroupChat(chatID, userID)
        const {_doc} = addUser
        res.status(200).json({..._doc})
    }catch({message}){
        res.status(400).json({...message})
    }
}

module.exports= { accessChats, fetchChats, creatGroupChat, renameChat, addUser}