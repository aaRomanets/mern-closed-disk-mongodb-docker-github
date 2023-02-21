import mongoose from "mongoose";

//база данных пользователей
const UserSchema = new mongoose.Schema(
{
    email: 
    {
        type: String, 
        required: true, 
        unique: true
    },
    password: 
    {
        type: String, 
        required: true
    },
    diskSpace: 
    {
        type: Number, 
        default: 1024**3*10
    },
    userSpace: 
    {
        type: Number, 
        default: 0
    },
    avatar: 
    {
        type: String
    },
    files: 
    [{
        type: mongoose.Schema.Types.ObjectId, 
        ref: "File"
    }]
})

export default mongoose.model('User', UserSchema);