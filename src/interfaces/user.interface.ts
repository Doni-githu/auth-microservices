import { Request } from "express";

export interface IUser {
    username: string,
    email: string,
    password: string,
    _id: string,
    __v: number
}

export interface IRequest extends Request {
    user: IUser 
}

export interface IBody extends Omit<IUser, "__v" | "_id"> { }