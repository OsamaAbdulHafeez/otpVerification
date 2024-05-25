import mongoose from "mongoose";


const UserSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    otp:{
        type: String,
    },
    expiresIn:{
        type:Date
    }
}, { timestamps: true })


export default mongoose.model('User', UserSchema)