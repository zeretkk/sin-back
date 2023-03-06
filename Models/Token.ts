import mongoose, {Schema} from "mongoose";
export interface IToken extends mongoose.Document{
    user: String
    refreshToken: String
}

export const tokenSchema :Schema = new mongoose.Schema({
    user: {type: Schema.Types.ObjectId, ref:'User'},
    refreshToken: {type: String, required: true}
})
const Token = mongoose.model<IToken>('Token', tokenSchema)
export default Token