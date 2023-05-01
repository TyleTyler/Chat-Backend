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


    chatSchema.statics.fetchChats = async function(userID){
        try{ 
            const fetchedChat = await this.find( {users : { $elemMatch: { $eq : userID }}})
            .populate("users", "-password")
            .populate("groupAdmin", "-password")
            return fetchedChat
        }catch(error){
            throw new Error(error)
        }
    }

    chatSchema.statics.createGroupChat = async function(userlist, chatName){
        if(userlist < 2){
            throw new Error("Must have more than 2 users in the group chat")
        }
        try {
            const gc = {
                chatName: chatName,
                isGroupChat: true,
                users : userlist,
                groupAdmin: userlist[0]
            }
            await this.create(gc)
        } catch (error) {
            throw new Error(error)
        }
    }  
    
    chatSchema.statics.renameChat = async function(groupChatID, chatName){
        try{ 
            const groupChat = this.findById(groupChatID)
            .populate("users", "-password")
            .populate("groupAdmin", "-password")
            if(groupChat.isGroupChat){
                throw new Error("Cannot perform this on a direct message")
            }
            await this.findByIdAndUpdate( groupChatID, {
                chatName 
            },
            {
                new: true
            }
            )
            
            return groupChat
        }
        catch(error){
            throw new Error(error)
        }
    }

    chatSchema.statics.addUserToGroupChat =  async function(chatID, userID){
        try{
            const userAdd =await this.findByIdAndUpdate(chatID,
                {$push: {users: userID}},
                {new :true}
                )
                .populate('users', '-password')
                .populate('groupAdmin', "-password")
            if(!userAdd){
                throw new Error("Chat not found")
            }
            return userAdd
        }catch(error){
            throw new Error(Error)
        }
    }


    chatSchema.statics.removeUserToGroupChat =  async function(chatID, userID){
        try{
            const userAdd =await this.findByIdAndUpdate(chatID,
                {$pull: {users: userID}},
                {new :true}
                )
                .populate('users', '-password')
                .populate('groupAdmin', "-password")
            if(!userAdd){
                throw new Error("Chat not found")
            }
            return userAdd
        }catch(error){
            throw new Error(Error)
        }
    }



module.exports = mongoose.model("Chat" , chatSchema )