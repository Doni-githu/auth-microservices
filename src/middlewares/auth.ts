import { Response, NextFunction } from "express";
import Token from "../utils/token";
import User from "../models/user";
import { IRequest, IUser } from "../interfaces/user.interface";


export default async function (req: IRequest, res: Response, next: NextFunction) {
    if (!req.headers.authorization) {
        res.status(400).json({
            message: 'User is not authorized'
        })
        next()
    }

    const decodedUserId = Token.decode(req.headers.authorization.replace('Token ', ''))

    if (!decodedUserId?.payload || !decodedUserId) {
        res.status(400).json({
            message: 'not authorized'
        })
        next()
        return
    }
    const id = decodedUserId.payload
    const user = await User.findById<IUser>(id)
    req.user = user
    next()
}