"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
const mongoose_1 = __importDefault(require("mongoose"));
const userRoutes_1 = __importDefault(require("./routes/userRoutes"));
const loginRoutes_1 = __importDefault(require("./routes/loginRoutes"));
const productRoutes_1 = __importDefault(require("./routes/productRoutes"));
const cartRoutes_1 = __importDefault(require("./routes/cartRoutes"));
const authMiddleware_1 = require("./middlewares/authMiddleware");
const refreshTokenMiddleware_1 = require("./middlewares/refreshTokenMiddleware");
const cookie_parser_1 = __importDefault(require("cookie-parser"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const port = process.env.PORT || 3000;
const mongoUri = process.env.MONGO_URI;
app.use((0, cors_1.default)({
    origin: [
        "http://127.0.0.1:5500",
        "http://localhost:5500",
        "http://localhost:3000",
    ],
    credentials: true,
}));
app.use(express_1.default.json({ limit: "10mb" }));
app.use((0, cookie_parser_1.default)());
app.use("/api/auth", loginRoutes_1.default);
app.use("/api/users", authMiddleware_1.authMiddleware, userRoutes_1.default);
app.use("/api/cart", authMiddleware_1.authMiddleware, cartRoutes_1.default);
app.use("/api/products", productRoutes_1.default);
app.post("/api/refresh-token", refreshTokenMiddleware_1.refreshTokenMiddleware, (req, res) => {
    res.json({ message: "Token actualizado correctamente" });
});
app.get("/", (req, res) => {
    res.send("API funcionando correctamente");
});
const connectToDb = async () => {
    try {
        await mongoose_1.default.connect(mongoUri);
        console.log("MongoDB conectado exitosamente");
    }
    catch (error) {
        console.error(`Error de conexión a MongoDB: ${error}`);
        process.exit(1);
    }
};
connectToDb();
app.listen(port, () => {
    console.log(`Servidor ejecutándose en puerto ${port}`);
});
