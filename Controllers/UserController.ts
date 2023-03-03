import {Request, Response, NextFunction} from "express";
import UserService from "./User.service";

export class UserController{
    static async register(req: Request, res:Response, next: NextFunction){
        try {
            const {username, email, password} = req.body
            const registeredUser = await UserService.register(username, email, password)
            res.cookie('refreshToken', registeredUser.refreshToken, {
                httpOnly: true,
                maxAge: 30 * 1000 * 60 * 60 * 24 * 30
            })
            res.status(204).json(registeredUser)
        }catch (e) {
            next(e)
        }
    }

    static async login(req: Request, res:Response, next: NextFunction){
        try {
            const {username, password} = req.body
            const loginInfo = await UserService.login(username, password)
            res.cookie('refreshToken', loginInfo.refreshToken, {
                httpOnly: true,
                maxAge: 30 * 1000 * 60 * 60 * 24 * 30
            })
            res.json(loginInfo)
        }catch (e){
            next(e)
        }
    }
    static logout(req: Request, res:Response, next: NextFunction){
        try {
            const {refreshToken} = req.cookies
            UserService.logout(refreshToken)
            res.clearCookie('refreshToken')
            res.json({status: 'success'})
        }catch (e){
            next(e)
        }
    }
    static async refresh(req: Request, res:Response, next: NextFunction){
        try {
            const {refreshToken} = req.cookies
            const userData = await UserService.refresh(refreshToken)
            res.cookie('refreshToken', userData.refreshToken, {
                httpOnly: true,
                maxAge: 30 * 1000 * 60 * 60 * 24 * 30
            })
            res.json(userData)
        } catch (e) {
            next(e)
        }
    }
    static async getByUsername(req: Request, res:Response, next:NextFunction){
        try {
            const {username} = req.params
            const userData = await UserService.getByUsername(username)
            res.json(userData)
        } catch (e) {
            next(e)
        }
    }
}