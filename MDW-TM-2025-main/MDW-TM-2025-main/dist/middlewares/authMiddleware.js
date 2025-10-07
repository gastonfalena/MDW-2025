"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authMiddleware = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const userModel_1 = __importDefault(require("../models/userModel"));
const authMiddleware = async (req, res, next) => {
    try {
        const accessToken = req.cookies.accessToken;
        if (!accessToken) {
            return res.status(401).json({ message: "Acceso no autorizado" });
        }
        const jwtAccessSecret = process.env.JWT_SECRET;
        if (!jwtAccessSecret) {
            return res
                .status(500)
                .json({ message: "Error de configuración del servidor" });
        }
        const decoded = jsonwebtoken_1.default.verify(accessToken, jwtAccessSecret);
        const user = await userModel_1.default.findById(decoded.userId).select("-password");
        if (!user) {
            return res.status(401).json({ message: "Usuario no encontrado" });
        }
        req.user = user;
        next();
    }
    catch (error) {
        if (error instanceof jsonwebtoken_1.default.TokenExpiredError) {
            return res.status(401).json({ message: "Token expirado" });
        }
        return res.status(401).json({ message: "Token inválido" });
    }
};
exports.authMiddleware = authMiddleware;
