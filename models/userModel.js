const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const validator = require('validator')



const userSchema = mongoose.Schema({
    username: { 
        type: String, 
        required: true,
    },
    password: {
        type: "String",
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    friendCode: {
        type: String,
        required: true,
        unique: true,
    },
    friends:{
        type: Array
    },
    friendRequest:{
        type: Array
    }
})

const generateFriendCode = () =>  {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    while (result.length < 6) {
      result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
}




 //*Static signup method
userSchema.statics.signup = async function(username, email, password){
    //Validation
    const exists = await this.findOne({email})
    let friendCode = generateFriendCode()
    let friendCodeExists = await this.findOne({friendCode})
    while(friendCodeExists){
        friendCode = generateFriendCode()
    }

    if(exists){
        throw Error("Email already in use")
    }
    if(!email || !password || !username){
        throw new Error("All fields should be filled")
    }
    if(!validator.isEmail(email)){
        throw Error("This is not a valid email")
    }
    if(!validator.isStrongPassword(password)){
        throw Error("Password not strong enough")
    }


    
    const salt = await bcrypt.genSalt(5)
    const hashedPassword = await bcrypt.hash(password, salt)

    const user = await this.create({username, email, password: hashedPassword, friendCode})

    return user;

}


//*Static login method
userSchema.statics.login = async function(email, password){
    if(!email || !password){
        throw new Error("All fields should be filled")
    }
    const user = await this.findOne({email})
    if(!user){
        throw Error("Incorrect email")
    }
    const match = await bcrypt.compare(password, user.password)
    if(!match){
        throw Error("Incorrect Password")
    }
    return user;
    
}


//*Static add method
userSchema.statics.addFriend = async function(email, friendCode){
    const exists = await this.findOne({friendCode})
    const user = await this.findOne({email})
    if(!exists){
        throw new Error("Invalid Friend Code")
    }
    if(exists.email == email){
        throw new Error("You cannot friend yourself")
    }
    for(friend of user.friends){
        if(friend.friendCode == friendCode){
            throw new Error("You already have this person friended")
        }
    }
    for(request of exists.friendRequest){
        console.log(request)
        if(request.email == email){
            throw new Error("You already sent this person a friend request")
        }
    }
    const friendReq = await this.updateOne(
            {friendCode},
            {$addToSet : {friendRequest: user}}
    )
    
    return user;
}


//*Static Accept Friend Method
userSchema.statics.acceptReq = async function(userID, friendID){

    const user = await this.findById(userID)
    const friend = await this.findById(friendID)
    try {
        await this.findById(userID).then( user=>{
            user.friendRequest = user.friendRequest.filter(friend => friend._id != friendID)
            user.save()
        })
        await this.findByIdAndUpdate(userID,{$addToSet : {friends: friend}});
        await this.findByIdAndUpdate(friendID,{$addToSet : {friends: user}});
    }catch(error){
        throw new Error(error)
    }
    return user
}


//*Static Remove Friend method
userSchema.statics.removeFriend = async function(userID, friendID){
    const user = await this.findById(userID)
    for(friend of user.friends){
        if(friend._id == friendID){
            await this.findById(userID).then(user =>{
                user.friends = user.friends.filter(friend => friend._id != friendID)
                user.save()
            })
            await this.findById(friendID).then(user =>{
                user.friends = user.friends.filter(friend => friend._id != userID)
                user.save()
            })

            return user;
        }
    }
    throw new Error("You don't have this friend")
}

//*Static Reject Friend Request method
userSchema.statics.rejectReq = async function(userID, friendID){
    const user = await this.findById(userID)
    for(friend of user.friends){
        if(friend._id == friendID){
            await this.findById(userID).then(user =>{
                user.friends = user.friendRequest.filter(friend => friend._id != friendID)
                user.save()
            })
            await this.findById(friendID).then(user =>{
                user.friends = user.friendRequest.filter(friend => friend._id != userID)
                user.save()
            })

            return user;
        }
    }
    throw new Error("You don't have this friend")
}

module.exports = mongoose.model('User', userSchema)