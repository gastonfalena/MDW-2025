"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logout = exports.login = exports.updateUser = exports.deleteUser = exports.getUser = exports.getUsers = exports.registerUser = void 0;
const userModel_1 = __importDefault(require("../models/userModel"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const registerUser = async (req, res) => {
    try {
        const userData = req.body;
        const existingUser = await userModel_1.default.findOne({ email: userData.email });
        if (existingUser) {
            return res.status(400).json({ error: "El usuario ya existe" });
        }
        const hashPassword = await bcrypt_1.default.hash(userData.password, 10);
        const newUser = await userModel_1.default.create({
            ...userData,
            password: hashPassword,
        });
        const userResponse = { ...newUser.toObject() };
        delete userResponse.password;
        res.status(201).json(userResponse);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};
exports.registerUser = registerUser;
const getUsers = async (req, res) => {
    try {
        const users = await userModel_1.default.find().select("-password");
        res.status(200).json(users);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};
exports.getUsers = getUsers;
const getUser = async (req, res) => {
    try {
        const user = await userModel_1.default.findById(req.params.id).select("-password");
        if (!user) {
            return res.status(404).json({ error: "Usuario no encontrado" });
        }
        res.status(200).json(user);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};
exports.getUser = getUser;
const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await userModel_1.default.findByIdAndDelete(id);
        if (!user)
            return res.status(404).json({ error: "Usuario no encontrado" });
        res.json({ message: "Usuario eliminado correctamente" });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};
exports.deleteUser = deleteUser;
const updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        if (req.body.password) {
            req.body.password = await bcrypt_1.default.hash(req.body.password, 10);
        }
        const user = await userModel_1.default.findByIdAndUpdate(id, req.body, {
            new: true,
        }).select("-password");
        if (!user)
            return res.status(404).json({ error: "Usuario no encontrado" });
        res.status(200).json(user);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};
exports.updateUser = updateUser;
const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const jwtAccessSecret = process.env.JWT_SECRET;
        const jwtAccessExpiresIn = process.env.JWT_EXPIRES_IN;
        const jwtRefreshSecret = process.env.JWT_REFRESH_SECRET;
        const jwtRefreshExpiresIn = process.env.JWT_REFRESH_EXPIRES_IN;
        const findUser = await userModel_1.default.findOne({ email });
        if (!findUser)
            return res.status(404).json({ message: "Usuario no encontrado" });
        const isMatch = await bcrypt_1.default.compare(password, findUser.password);
        if (!isMatch)
            return res.status(401).json({ message: "Credenciales inválidas" });
        if (!jwtAccessSecret || !jwtRefreshSecret) {
            return res.status(500).json({ message: "JWT no definido" });
        }
        const accessToken = jsonwebtoken_1.default.sign({ userId: findUser._id.toString(), email: findUser.email }, jwtAccessSecret, { expiresIn: jwtAccessExpiresIn });
        const refreshToken = jsonwebtoken_1.default.sign({ userId: findUser._id.toString() }, jwtRefreshSecret, { expiresIn: jwtRefreshExpiresIn });
        res.cookie("accessToken", accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 15 * 60 * 1000, // 15 minutes
        });
        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        });
        const userResponse = { ...findUser.toObject() };
        delete userResponse.password;
        return res.json({
            message: "Login exitoso",
            user: userResponse,
        });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};
exports.login = login;
const logout = async (req, res) => {
    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");
    return res.json({ message: "Logout exitoso" });
};
exports.logout = logout;
