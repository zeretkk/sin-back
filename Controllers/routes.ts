import Router from 'express'
import {UserController} from "./UserController";
import {authMiddleware} from "../helpers/auth";
import express from "express";

const router = Router()

router.post('/login', UserController.login)
router.post('/register', UserController.register)
router.get('/logout', UserController.logout)
router.get('/refresh', UserController.refresh)
router.use(authMiddleware as express.Handler)
router.get('/:username?', UserController.getByUsername)

export default router