import { Router } from "express";
import AuthMiddleware from "../middlewares/auth";
import Token from "../utils/token"
import { IBody, IRequest } from "../interfaces/user.interface";
import User from "../models/user";
import bcrypt from "bcrypt"

const router = Router()

router.get('/auth', AuthMiddleware, async (req:IRequest, res) => {
    res.status(200).json(req.user)
})

router.post('/signup', async (req, res) => {
    const { email, password, username } = req.body as IBody
    const candidate = await User.findOne({ email })
    if (candidate) {
        res.status(400).json({
            message: "User already exists"
        })
        return
    }

    const hashPassword = await bcrypt.hash(password, 10)

    const user = await User.create({
        email,
        password: hashPassword,
        username
    })

    const token = Token.encode(String(user._id))
    res.status(200).json({
        token,
        user
    })
})

router.post('/login', async (req, res) => {
    const { email, password } = req.body as Omit<IBody, "username">

    const isExistsUser = await User.findOne({ email })

    if (!isExistsUser) {
        res.status(400).json({
            message: 'User not found'
        })
        return
    }

    const isThisUser = await bcrypt.compare(password, isExistsUser.password)

    if (!isThisUser) {
        res.status(401).json({
            message: 'Password is incorrect'
        })
        return
    }

    const token = Token.encode(String(isExistsUser._id))
    res.status(200).json({
        token,
        user: isExistsUser
    })
})

router.get('/user', AuthMiddleware, async (req: IRequest, res) => {
    res.status(200).json(req.user)
})

export default router