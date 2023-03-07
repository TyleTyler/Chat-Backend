const User = require("../models/userModel")
const jwt = require("jsonwebtoken")
require("dotenv").config()

const createToken = (_id) =>{
    return  jwt.sign({_id}, process.env.SECRET, {expiresIn: '3d'})
}


//*Function that signs up a user
//?The request body has to have an email, password, and username
const signup = async function(req, res){
    const {username, email, password}= req.body
    try{
        const signup = await User.signup(username, email, password)
        //create a jwt token
        const token =  createToken(signup._id)
        res.status(200).json({...signup, token})
    }catch(error){
        res.status(400).json({error: error.message})
    }
}

//*Function that logs in a user
//?The request body has to have an email and password 
const login = async function(req, res){
    const {email, password} = req.body
    try{
        const login = await User.login(email, password)
        //create a jwt token
        const token =  createToken(login._id)
        res.status(200).json({...login, token})
    }catch(error){
        res.status(400).json({error: error.message})
    }
}

//*This general fucntion returns every user in the DB
//?This does not intake any parameters
const getAll = async (req, res) => {
    const users = await User.find()
    try {
        res.status(200).json({...users})
    }catch(error){
        res.status(400).json({error})
    }
}


//*This function sends a friend request to a respective friendCode owner
//?The request parameters must contain an email and a friendCode
const sendFriendRequest = async (req, res)=>{
    const {email, friendcode} = req.params
    try{
        const status = await User.addFriend(email, friendcode)
        res.status(200).json({...status})
    }catch({message}){
        res.status(400).json({message})
    }
}


//*This functions accepts a friend request
//?The request must contain both ID's of recipeient and the sender
const acceptRequest = async (req, res)=>{
    const {userID, friendID} = req.params
    try{
        const status = await User.acceptReq(userID, friendID)
        res.status(200).json({message: "Accepted Friend!"})
    }catch({message}){
        res.status(400).json({message})
    }
}


//*THis function removes a friend
//?The request must contain both ID's of recipeient and the sender
const removeFriend = async (req, res)=>{
    const {userID, friendID} = req.params
    try{
        const status = await User.removeFriend(userID, friendID)
        res.status(200).json({message : "Removed Friend!"})
    }catch({message}){
        res.status(400).json({message})
    }
}


//*This Function returns a user
//?The request parameter must cotain a valid userID
const getUser = async (req, res)=>{
    const {userID} = req.params
    try{
        const user = await User.findById(userID)
        res.status(200).json({...user})
    }catch({message}){
        res.status(400).json({message})
    }
}

//*THis function rejects a friend request
//?The request must contain both ID's of recipeient and the sender
const rejectRequest = async (req, res)=>{
    const {userID, friendID} = req.params
    try{
        const status = await User.rejectReq(userID, friendID)
        res.status(200).json({message : "Rejected Request"})
    }catch({message}){
        res.status(400).json({message})
    }
}


module.exports = {signup , login, getAll, sendFriendRequest, acceptRequest, rejectRequest, removeFriend, getUser}  