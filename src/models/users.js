const req = require("express/lib/request")
const res = require("express/lib/response")
const mongoose = require(`mongoose`)
const validator = require(`validator`)
const bcrypt = require(`bcrypt`)
const jwt = require("jsonwebtoken")
const Task = require(`./tasks.js`)
//const {hashPassword, validatePassword} = require(`./passwordSettings.js`)
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        unique: true,
        required: true,
        trim: true,
        lowercase: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error(`Please Enter Valid email`)
            }
        }
    },
    password: {
        type: String,
        required: true,
        minlength: 6,
        trim: true,
        validate(value) {
            if (value.toLowerCase().includes(`password`)) {
                throw new Error(`Password cannot contain 'password `)
            }
        }
    },
    age: {
        type: Number,
        validate(value) {
            if (value < 0) {
                throw new Error(`Age must be positive number`)
            }
        },
        default: 0
    },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }]
},{
        timestamps:true
})


userSchema.virtual(`tasks`, {
    ref: `Task`,
    localField: `_id`,
    foreignField: `owner`
})
//for getting UserProfile
userSchema.methods.toJSON = function () {
    const user = this
    const userObject = user.toObject()
    delete userObject.password
    delete userObject.tokens
    return userObject
}
userSchema.methods.generateAuthToken = async function () {
    const user = this
    const token = jwt.sign({ _id: user._id.toString() }, 'userauthenticationSettimgs')
    user.tokens = user.tokens.concat({ token })
    await user.save()
    return token
}


//Credentials Settings
userSchema.statics.findByCredentials = async (email, password) => {

    const user = await User.findOne({ email: email })

    if (!user) {
        throw new Error(`Unable to login`)
    }
    const isMatch = await bcrypt.compare(password, user.password)
    // console.log(password)
    // console.log(user.password)
    // console.log(user)
    if (!isMatch) {
        throw new Error(`Unable to login`)
    }
    else {
        return user
    }
    //    const hash = await hashPassword(password)
    //    console.log(validator.equals(hash,user.password))
    //console.log(isMatch)
    //const isMatch = await validatePassword(hash,user.password)
}




//---------------------Hash the plaintext password before saving------------------
//first parameter action,Second parameter should be standard function because this binding is using here
userSchema.pre(`save`, async function (next) {
    const user = this
    if (user.isModified('password')) {
        // user.password = await hashPassword(user.password)
        user.password = await bcrypt.hash(user.password, 8)
    }
    next()
})

//delete user tasks when user is removed
userSchema.pre(`remove`, async function (next) {
    const user = this
    await Task.deleteMany({ owner: user._id })
    next()
})
const User = mongoose.model(`User`, userSchema)
module.exports = User