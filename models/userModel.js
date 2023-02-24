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




module.exports = mongoose.model('User', userSchema)