import * as jwt from 'jsonwebtoken'
import Token ,{IToken} from "../Models/Token";
import {Response, NextFunction} from "express";
import RequestWithUser from "./extends";
import {HTTPException} from "./exceptions";
import {UserDto} from "../Controllers/User.dto";


export function generateJWTPair(payload: any) :{accessToken: string, refreshToken: string}{
    const accessToken = jwt.sign(payload, process.env.JWT_ACCESS_SECRET, {expiresIn:'30m'})
    const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET, {expiresIn:'30d'})
    return {accessToken, refreshToken}
}

export async function saveToken(userId: string, token: string) : Promise<IToken>{
    const savedToken = await Token.findOne({user:userId})
    if(savedToken){
        savedToken.refreshToken = token
        return savedToken.save()
    }
    return await Token.create({
        user: userId,
        refreshToken: token
    })
}
export function deleteToken(token: string){
    return Token.deleteOne({refreshToken: token})
}
export function validateToken(token: string, type: 'access' | 'refresh') : UserDto | null{
    try {
        switch (type){
            case "access":
                return jwt.verify(token, process.env.JWT_ACCESS_SECRET) as UserDto
            case "refresh":
                return jwt.verify(token, process.env.JWT_REFRESH_SECRET) as UserDto
        }
    }catch {
        return null
    }
}

export function authMiddleware(req: RequestWithUser, res: Response, next: NextFunction){
    try {
        const accessToken = req.headers['authorization']?.split(' ')[1]
        if(!accessToken){
            next(HTTPException.Unauthorized())
        }
        // @ts-ignore
        const userData = validateToken(accessToken, "access")
        if(!userData){
            next(HTTPException.Unauthorized())
        }
        req.user = userData
        next()
    }catch (e) {
        next(e)
    }
}