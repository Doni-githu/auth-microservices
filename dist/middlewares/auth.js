"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const token_1 = __importDefault(require("../utils/token"));
const user_1 = __importDefault(require("../models/user"));
async function default_1(req, res, next) {
    if (!req.headers.authorization) {
        res.status(400).json({
            message: 'User is not authorized'
        });
        next();
    }
    const decodedUserId = token_1.default.decode(req.headers.authorization.replace('Token ', ''));
    if (!decodedUserId?.payload || !decodedUserId) {
        res.status(400).json({
            message: 'not authorized'
        });
        next();
        return;
    }
    const id = decodedUserId.payload;
    const user = await user_1.default.findById(id);
    req.user = user;
    next();
}
exports.default = default_1;
//# sourceMappingURL=auth.js.map