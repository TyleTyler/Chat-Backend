const Message = require("../models/userModel")

const sendMessage = async (req, res)=>{
    const {senderID, content, chatID} = req.body
    try{
        const newMessage = await Message.sendMessage(senderID, content, chatID)
        res.status(200).json({...newMessage})
    }catch({message}){
        res.status(400).json({...message})
    }
}

const getChatMessages = async(req, res) =>{
    const {chatID} = req.params
    try{
        const chatMessages = await Message.getchatMessages(chatID)
        res.status(200).json({...chatMessages})
    }catch({message}){
        res.status(400).json({...message})
    }
}



module.exports = {sendMessage, getChatMessages}