import bcrypt from 'bcrypt'
import User from "../Models/User";
import {UserDto} from "./User.dto";
import {deleteToken, generateJWTPair, saveToken, validateToken} from "../helpers/auth";
import {HTTPException} from "../helpers/exceptions";
import Token from "../Models/Token";

export interface UserWithTokens{
    user: UserDto
    accessToken: string
    refreshToken: string
}
export default class UserService{
    static async register(username: string, email: string, password: string): Promise<UserWithTokens>{
        try {
            const hash = await bcrypt.hash(password,10)
            const user = await User.create({
                username: username,
                email: email,
                password: hash
            })
            const userDto = new UserDto(user)
            const tokens = generateJWTPair({...userDto})
            await saveToken(user._id, tokens.refreshToken)
            return <UserWithTokens>{...tokens, user:userDto}
        }catch (e){
            // @ts-ignore
            switch (e?.code){
                case 11000:
                    throw HTTPException.BadRequest("Username and Email must be unique")
                default:
                    throw HTTPException.Internal()
            }
        }
    }
    static async login(username: string, password: string) : Promise<UserWithTokens>{
        const user = await User.findOne({username: username})
        if(!user){
            throw HTTPException.BadRequest('Unknown username')
        }
        if(!bcrypt.compareSync(password, user.password)){
            throw HTTPException.Unauthorized()
        }
        const userDto = new UserDto(user)
        const tokens = generateJWTPair({...userDto})
        await saveToken(user._id, tokens.refreshToken)
        return <UserWithTokens>{...tokens, user:userDto}
    }

    static logout(refreshToken: string){
        deleteToken(refreshToken)
    }

    static async refresh(refreshToken: string) : Promise<UserWithTokens>{
        if(!refreshToken){
            throw HTTPException.Unauthorized()
        }
        const userData = validateToken(refreshToken, 'refresh')
        const savedToken = await Token.findOne({refreshToken:refreshToken})
        if(!userData || !savedToken){
            if(!userData){
                savedToken?.deleteOne({refreshToken})
            }
            throw HTTPException.Unauthorized()
        }
        const user = await User.findOne({username: userData.username})
        const userDto = new UserDto(user)
        const tokens = generateJWTPair({...userDto})
        return {...tokens, refreshToken, user:userDto}
    }

    static async getByUsername(username :string) : Promise<UserDto>{
        if(!username){
            throw HTTPException.BadRequest("Username must be specified")
        }
        const found = await User.findOne({username})
        if(!found){
            throw HTTPException.NotFound()
        }
        return new UserDto(found)
    }


}