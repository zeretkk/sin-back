import {Request} from "express";
import {UserDto} from "../Controllers/User.dto";

export default interface RequestWithUser extends Request{
    user :UserDto |null
}