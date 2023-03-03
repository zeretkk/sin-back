import mongoose from "mongoose";


export interface IUser extends mongoose.Document{
    username: string
    email: string
    password: string
    bio: string
    cover: string
    volume: Number
    sold: Number
    followers: Number
    links: [string]
    created: Date
}

export const userSchema = new mongoose.Schema({
    username: String,
    email: String,
    password: String,
    bio: { type: String, default: '' },
    cover: { type: String, default: '' },
    volume: { type: Number, default: 0 },
    sold: { type: Number, default: 0 },
    followers: { type: Number, default: 0 },
    links: [String],
    createdAt: { type: Date, default: Date.now },
})

const User = mongoose.model<IUser>('User', userSchema)
export default User