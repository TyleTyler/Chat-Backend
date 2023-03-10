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
        type: mongoose,
        required: true,
    },
    groupAdmin:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    friendRequest:{
        type: Array
    }
    }, {
        timestamps: true   
    })



module.exports = mongoose.model("Chat" , chatSchema )