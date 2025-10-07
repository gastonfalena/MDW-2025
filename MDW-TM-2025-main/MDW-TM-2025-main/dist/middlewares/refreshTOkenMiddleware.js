"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.refreshTokenMiddleware = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const userModel_1 = __importDefault(require("../models/userModel"));
const refreshTokenMiddleware = async (req, res, next) => {
    try {
        const refreshToken = req.cookies.refreshToken;
        if (!refreshToken) {
            return res.status(401).json({ message: "Refresh token no encontrado" });
        }
        const jwtRefreshSecret = process.env.JWT_REFRESH_SECRET;
        if (!jwtRefreshSecret) {
            return res
                .status(500)
                .json({ message: "Error de configuración del servidor" });
        }
        const decoded = jsonwebtoken_1.default.verify(refreshToken, jwtRefreshSecret);
        const user = await userModel_1.default.findById(decoded.userId);
        if (!user) {
            return res.status(401).json({ message: "Usuario no encontrado" });
        }
        const jwtAccessSecret = process.env.JWT_SECRET;
        const jwtAccessExpiresIn = process.env.JWT_EXPIRES_IN;
        const newAccessToken = jsonwebtoken_1.default.sign({ userId: user._id.toString(), email: user.email }, jwtAccessSecret, { expiresIn: jwtAccessExpiresIn });
        res.cookie("accessToken", newAccessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 60 * 1000,
        });
        next();
    }
    catch (error) {
        return res.status(401).json({ message: "Refresh token inválido" });
    }
};
exports.refreshTokenMiddleware = refreshTokenMiddleware;
