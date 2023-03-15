const mongoose = require('mongoose')
const User = require("./userModel")


const chatSchema = mongoose.Schema({
    chatName: { 
        type: String, 
        required: true,
    },
    isGroupChat: {
        type: "Boolean",
        default: false,
    },
    users: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    }],
    latestMessage: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Message",
    },
    groupAdmin:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
    }, {
        timestamps: true   
    })

    chatSchema.statics.accessChats = async function(userID, friendID){
        if(!userID){
            throw new Error("UserID required but not found")
        }
        let isChat = await this.find({
            isGroupChat:false,
            $and:[
                {users: {$elemMatch: {$eq: userID}}},
                {users: {$elemMatch: {$eq: friendID}}}
            ]
        }).populate("users", "-password")
            .populate("latestMessage")
        isChat = await User.populate(isChat, {
            path:"latestMessage.sender",
            select:"username email"
        })
        
        if(isChat.length >0){
            return isChat[0]
        }else{
            const newChat = {
                chatName: "sender",
                isGroupChat: false,
                users: [userID, friendID],
            }
            try{
                let createdChat = await this.create(newChat)
                let updatedChat = await this.findById(createdChat._id).populate("users", "-password")

                return updatedChat

            }catch(error){
                throw new Error(error)
            }
        }
    }

module.exports = mongoose.model("Chat" , chatSchema )