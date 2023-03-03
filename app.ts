import express, {Express, json, Request, Response} from 'express';
import cookieParser from 'cookie-parser'
import cors from 'cors'
import dotenv from 'dotenv';
import mongoose from "mongoose";
import {Secret} from "jsonwebtoken";
import UserRouter from './Controllers/routes'
import {exceptionHandler} from "./helpers/exceptions";
import bodyParser from "body-parser";
dotenv.config();
interface IProcessEnv{
    DB_USER: String
    DB_PASS: String
    JWT_ACCESS_SECRET: Secret
    JWT_REFRESH_SECRET: Secret
}
declare global {
    namespace NodeJS {
        interface ProcessEnv extends IProcessEnv { }
    }
}

const app: Express = express();
const port = 3001
app.use(cookieParser())
app.use(bodyParser.json())
app.use(json())
app.use( cors({
    origin: function (origin, callback) {
        return callback(null, true)
    },
    optionsSuccessStatus: 200,
    credentials: true,
}))
app.use('/user',UserRouter)
app.use(exceptionHandler)
app.listen(port, async () => {
    await mongoose.connect(
        `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@sinc0.s7xsi06.mongodb.net/sin?retryWrites=true&w=majority`
    );
    console.log(`Listening http://localhost:${port}`);
});