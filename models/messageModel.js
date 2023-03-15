//content
//sender
//timeStamp
//chat
const mongoose = require('mongoose')


const messageSchema = mongoose.Schema({
    sender: { 
        type: mongoose.Schema.Types.ObjectId,
        ref: "User", 
        required: true,
    },
    content: {
        type: "String",
        default: false,
    },
    chat: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Chat",
        required: true,
    },
    }, {
        timestamps: true   
    })

    messageSchema.statics.sendMessage = async function(senderID, content, chatID){
        const sender = await this.findById(senderID)
        const chat = await this.findById(chatID)
        if(content === ""){
            throw new Error("Message cannot be empty")
        }
        if(!sender){
            throw new Error("This user does not exist")
        }


    }



module.exports = mongoose.model("Message" , messageSchema )