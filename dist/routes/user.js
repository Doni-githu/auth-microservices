"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = __importDefault(require("../middlewares/auth"));
const token_1 = __importDefault(require("../utils/token"));
const user_1 = __importDefault(require("../models/user"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const router = (0, express_1.Router)();
router.get('/auth', auth_1.default, async (req, res) => {
    res.status(200).json(req.user);
});
router.post('/signup', async (req, res) => {
    const { email, password, username } = req.body;
    const candidate = await user_1.default.findOne({ email });
    if (candidate) {
        res.status(400).json({
            message: "User already exists"
        });
        return;
    }
    const hashPassword = await bcrypt_1.default.hash(password, 10);
    const user = await user_1.default.create({
        email,
        password: hashPassword,
        username
    });
    const token = token_1.default.encode(String(user._id));
    res.status(200).json({
        token,
        user
    });
});
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    const isExistsUser = await user_1.default.findOne({ email });
    if (!isExistsUser) {
        res.status(400).json({
            message: 'User not found'
        });
        return;
    }
    const isThisUser = await bcrypt_1.default.compare(password, isExistsUser.password);
    if (!isThisUser) {
        res.status(401).json({
            message: 'Password is incorrect'
        });
        return;
    }
    const token = token_1.default.encode(String(isExistsUser._id));
    res.status(200).json({
        token,
        user: isExistsUser
    });
});
router.get('/user', auth_1.default, async (req, res) => {
    res.status(200).json(req.user);
});
exports.default = router;
//# sourceMappingURL=user.js.map