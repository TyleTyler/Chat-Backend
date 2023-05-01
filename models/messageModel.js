//content
//sender
//timeStamp
//chat
const mongoose = require('mongoose')
const Chat = require("./chatModel")

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

messageSchema.statics.sendMessage = async function (senderID, content, chatID) {
    const sender = await this.findById(senderID)
    const chat = await this.findById(chatID)
    if (content === "") {
        throw new Error("Message cannot be empty")
    }
    if (!sender) {
        throw new Error("This user does not exist")
    }
    try {
        const newMessage = await this.create({
            sender: senderID,
            content,
            chat: chatID
        })
            .populate("sender", "-password")
            .populate("chat")
        await User.populate(message, {
            path: "chat.users",
            select: "username email"
        })
        await chat.findByIdAndUpdate(chatID)
        return newMessage;
    } catch (error) {
        throw new Error(error)
    }

}

messageSchema.statics.getChatMessages = async function (chatID) {
    try {
        const messages = await this.find({ chat: chatID })
            .populate("sender", "username")
            .populate("chat")
            return messages
    } catch (error) {
        throw Error(error) 
    }
}


module.exports = mongoose.model("Message", messageSchema)