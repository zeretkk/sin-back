import {Response, Request, NextFunction} from "express";

class HTTPException extends Error{
    public status :number
    public errors :any[]
    constructor(status :number, message :string, errors :any[]=[]) {
        super(message);
        this.status = status
        this.errors = errors
    }
    static Unauthorized() :HTTPException{
        return new HTTPException(401, 'Unauthorized')
    }
    static BadRequest(message :string, errors :any[]=[]) :HTTPException{
        return new HTTPException(400, message, errors)
    }
    static Internal(errors :[]=[]) :HTTPException{
        return new HTTPException(500, 'Internal Server Error', errors)
    }
    static NotFound() :HTTPException{
        return new HTTPException(404, 'Resource Not Found')
    }
}
function exceptionHandler(err :any, req :Request, res :Response, next :NextFunction){
    if(err instanceof HTTPException){
        if(err.status === 401){
            res.clearCookie('refreshToken')
        }
        return res.status(err.status).json({message: err.message, errors:err.errors})
    }
    return res.status(500).json({message:"Internal Server Error"})
}

export {HTTPException, exceptionHandler}