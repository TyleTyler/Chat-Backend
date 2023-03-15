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

module.exports= { accessChats}